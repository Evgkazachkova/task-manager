import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '@app/core/services/notification.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Произошла неизвестная ошибка';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Ошибка клиента: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Некорректный запрос';
            break;
          case 401:
            errorMessage = 'Не авторизован';
            break;
          case 403:
            errorMessage = 'Доступ запрещен';
            break;
          case 404:
            errorMessage = 'Ресурс не найден';
            break;
          case 500:
            errorMessage = 'Внутренняя ошибка сервера';
            break;
          default:
            errorMessage = `Ошибка сервера: ${error.status}`;
        }
      }

      notificationService.showNotification(errorMessage);

      return throwError(() => error);
    })
  );
};
