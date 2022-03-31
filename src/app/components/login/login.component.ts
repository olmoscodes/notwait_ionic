import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  auth2: any;

  name: string;



  @ViewChild('loginRef', { static: true }) loginElement!: ElementRef;

  constructor() { }

  ngOnInit() {
    this.googleAuthSDK();
    this.name = localStorage.getItem('loginTEST');

    const loginSwitcher = gsap.timeline({paused: true})

    loginSwitcher.to(".client", {pointerEvents: "none", opacity: 0, position: "absolute", duration: 0.3})
    .to(".business", {pointerEvents: "auto", opacity: 1}, "-=0.3")
    .to(".op-c", {backgroundColor: "rgba(255, 255, 255, 0.418)", color: "#53ae5475" }, "-=0.3")
    .to(".op-b", {backgroundColor: "white", color: "#53ae55" }, "-=0.3");


  
    let activateClient = document.getElementById("activateClient")!;
    let activateBusiness = document.getElementById("activateBusiness")!;

    let clientStatus = true;
    let businessStatus = false;

    activateClient.addEventListener("click", function () {
      if (clientStatus == false ) loginSwitcher.timeScale(3).reverse();
      clientStatus = true;
      businessStatus = false;
    }, false);

    activateBusiness.addEventListener("click", function () {
      if (businessStatus == false) loginSwitcher.timeScale(1).play();
      clientStatus = false;
      businessStatus = true;
    }, false);

  }

  /**
 * Write code on Method
 *
 * @return response()
 */
  callLoginButton() {
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleAuthUser: any) => {
        let profile = googleAuthUser.getBasicProfile();
        console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());

        /* Write Your Code Here */

        localStorage.setItem('loginTEST', profile.getName())
        location.reload();

      }, (error: any) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  logout() {
    localStorage.removeItem('loginTEST');
    location.reload();
  }

  googleAuthSDK() {
     
    (<any>window)['googleSDKLoaded'] = () => {
      (<any>window)['gapi'].load('auth2', () => {
        this.auth2 = (<any>window)['gapi'].auth2.init({
          client_id: '974521570945-r7p4t3afpgrbcbag7amrffspbojjdno8.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.callLoginButton();
      });
    }
     
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement('script'); 
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs?.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
   
  }

}
