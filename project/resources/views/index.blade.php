@extends('app')


@section('content')
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOMContentLoaded');
            self.addEventListener("push", (event) => {
                const data = event.data ? event.data.json() : {};
                const title = data.title || "Новое уведомление";
                const options = {
                    body: data.body || "Текст уведомления",
                    icon: "/icon.png", // добавь свою иконку
                };

                event.waitUntil(self.registration.showNotification(title, options));
            });

            self.addEventListener("notificationclick", (event) => {
                event.notification.close();
                event.waitUntil(
                    clients.openWindow("https://example.com") // куда открыть при клике
                );
            });
        })
    </script>
@endsection
