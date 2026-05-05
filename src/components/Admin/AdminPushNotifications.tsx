'use client';

import { useEffect, useState, useTransition } from 'react';

import {
  removeAdminPushSubscription,
  saveAdminPushSubscription,
} from '@/app/admin/push-actions';

type PushStatus = 'idle' | 'enabled' | 'unsupported' | 'denied' | 'error';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

async function getServiceWorkerRegistration() {
  const existingRegistration = await navigator.serviceWorker.getRegistration('/');

  return existingRegistration ?? navigator.serviceWorker.register('/sw.js');
}

export function AdminPushNotifications() {
  const [status, setStatus] = useState<PushStatus>('idle');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  useEffect(() => {
    let isMounted = true;

    async function checkPushState() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
        if (isMounted) {
          setStatus('unsupported');
          setMessage('Этот браузер не поддерживает push-уведомления.');
        }
        return;
      }

      if (Notification.permission === 'denied') {
        if (isMounted) {
          setStatus('denied');
          setMessage('Уведомления заблокированы в настройках браузера.');
        }
        return;
      }

      try {
        const registration = await getServiceWorkerRegistration();
        const subscription = await registration.pushManager.getSubscription();

        if (subscription && isMounted) {
          setStatus('enabled');
          setMessage('Уведомления уже включены на этом устройстве.');
        }
      } catch {
        if (isMounted) {
          setStatus('error');
          setMessage('Не удалось проверить подписку на уведомления.');
        }
      }
    }

    void checkPushState();

    return () => {
      isMounted = false;
    };
  }, []);

  function enableNotifications() {
    startTransition(async () => {
      if (!publicKey) {
        setStatus('error');
        setMessage('Не найден публичный VAPID-ключ.');
        return;
      }

      try {
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
          setStatus(permission === 'denied' ? 'denied' : 'idle');
          setMessage('Браузер не дал разрешение на уведомления.');
          return;
        }

        const registration = await getServiceWorkerRegistration();
        const subscription =
          (await registration.pushManager.getSubscription()) ??
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          }));

        const result = await saveAdminPushSubscription(subscription.toJSON());

        setStatus(result.ok ? 'enabled' : 'error');
        setMessage(result.message);
      } catch {
        setStatus('error');
        setMessage('Не удалось включить уведомления. Проверьте разрешения браузера.');
      }
    });
  }

  function disableNotifications() {
    startTransition(async () => {
      try {
        const registration = await getServiceWorkerRegistration();
        const subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          setStatus('idle');
          setMessage('На этом устройстве уведомления уже выключены.');
          return;
        }

        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        const result = await removeAdminPushSubscription(endpoint);

        setStatus('idle');
        setMessage(result.message);
      } catch {
        setStatus('error');
        setMessage('Не удалось выключить уведомления.');
      }
    });
  }

  const canEnable = status !== 'enabled' && status !== 'unsupported' && status !== 'denied';

  return (
    <section className="dashboard__card card-glass">
      <h2 className="dashboard__cardTitle">Push-уведомления</h2>
      <p className="dashboard__text">
        Включите уведомления на телефоне, чтобы сразу получать сообщение о новой записи.
      </p>

      <div className="dashboard__actions">
        {canEnable ? (
          <button className="btn btn-primary" type="button" disabled={isPending} onClick={enableNotifications}>
            {isPending ? 'Подключаем...' : 'Включить уведомления'}
          </button>
        ) : null}

        {status === 'enabled' ? (
          <button className="btn btn-outline-light" type="button" disabled={isPending} onClick={disableNotifications}>
            Выключить на этом устройстве
          </button>
        ) : null}
      </div>

      {message ? <p className="dashboard__muted">{message}</p> : null}
    </section>
  );
}
