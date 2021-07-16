
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from 'src/app/auth/services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private tokenStorage: TokenStorageService,
        private router: Router
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.tokenStorage.check()) {
        // logged in so return true
        return true;
    }

    // not logged in so redirect to home page with the return url
    this.router.navigate(['/']);
    return false;
  }
}
