import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, finalize, delay } from 'rxjs';
import { AnimationService } from './animation.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private requestCount = 0;
  private readonly minimumLoadingTime = 800; // Minimum loading time for better UX

  constructor(private animationService: AnimationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show loading for specific endpoints
    const shouldShowLoading = this.shouldShowLoadingForRequest(req);
    
    if (shouldShowLoading) {
      this.requestCount++;
      
      // Start loading animation if this is the first request
      if (this.requestCount === 1) {
        this.startLoadingWithMinimumTime();
      }
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (shouldShowLoading) {
          this.requestCount--;
          
          // Stop loading animation if no more pending requests
          if (this.requestCount === 0) {
            this.stopLoading();
          }
        }
      })
    );
  }

  private shouldShowLoadingForRequest(req: HttpRequest<any>): boolean {
    // Show loading for booking, payment, and data fetching endpoints
    const loadingEndpoints = [
      '/api/bookings',
      '/api/payments',
      '/api/auth',
      '/api/drivers',
      '/api/quotes'
    ];

    // Don't show loading for quick operations
    const excludedEndpoints = [
      '/api/health',
      '/api/ping',
      '/api/validate'
    ];

    const url = req.url.toLowerCase();
    
    return loadingEndpoints.some(endpoint => url.includes(endpoint)) &&
           !excludedEndpoints.some(endpoint => url.includes(endpoint)) &&
           (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE');
  }

  private startLoadingWithMinimumTime(): void {
    const startTime = Date.now();
    
    this.animationService.startLoadingSequence().subscribe(state => {
      if (!state.isLoading) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, this.minimumLoadingTime - elapsedTime);
        
        // Ensure minimum loading time for better perceived performance
        setTimeout(() => {
          // Loading will be stopped by the finalize operator
        }, remainingTime);
      }
    });
  }

  private stopLoading(): void {
    // Add a small delay to prevent flickering
    setTimeout(() => {
      // The animation service will handle stopping the loading state
    }, 200);
  }
}
