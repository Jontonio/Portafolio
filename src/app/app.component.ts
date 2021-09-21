import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ThemeServiceService } from './services/theme-service.service';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DecimalPipe } from '@angular/common';
import { NavegationPagesService } from './services/navegation-pages.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private stop$ = new Subject<void>();
  botonColores: boolean = false;
  collapsed = false;
  init = false;

  reachedTheEnd2: boolean;

  public reachedTheEnd: boolean;

  @ViewChild('inicio') home: ElementRef;
  @ViewChild('about') about: ElementRef;
  @ViewChild('skill') skill: ElementRef;
  @ViewChild('services') services: ElementRef;
  @ViewChild('qualification') qualification: ElementRef;

  title = 'scroll-page';
  seleccionado = 'Inicio';

  public estadoTheme: string = 'inicial';

  constructor(
    private readonly themeService: ThemeServiceService,
    private decimalPipe: DecimalPipe,
    private readonly _navigationPages: NavegationPagesService
  ) {}

  ngOnInit() {
    this.changeEstadoNav();
    this.defaultColor();
    this.defaultTheme();
    gsap.to('progress', {
      value: 100,
      scrollTrigger: {
        trigger: '.todo',
        scrub: 0.3,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (options) => {
          if (options instanceof ScrollTrigger) {
            const value = Number(
              this.decimalPipe.transform(options.progress, '1.2-2')
            );
            console.log(value);
            this.reachedTheEnd2 = value > 0.2;
            this.reachedTheEnd = value > 0.84;
          }
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.stop();
  }

  changeEstadoNav(): void {
    this._navigationPages.pagina$
      .pipe(takeUntil(this.stop$))
      .subscribe((pagina: string) => {
        switch (pagina) {
          case 'Inicio':
            this.elemetoHtmlSeleccionado(this.home);
            break;
          case 'Acerca':
            this.elemetoHtmlSeleccionado(this.about);
            break;
          case 'Habilidades':
            this.elemetoHtmlSeleccionado(this.skill);
            break;
          case 'Servicios':
            this.elemetoHtmlSeleccionado(this.services);
            break;
          case 'Experiencia':
            this.elemetoHtmlSeleccionado(this.qualification);
            break;

          default:
            break;
        }
      });
  }

  defaultTheme() {
    this.themeService.setDefaultTheme();
  }

  defaultColor(): void {
    this.themeService.setPurple();
  }
  elemetoHtmlSeleccionado(elem: ElementRef) {
    const elementoNat = elem.nativeElement;
    elementoNat.scrollIntoView({ behavior: 'smooth' });
  }

  onClick(elem: HTMLElement) {
    this._navigationPages.seleccionado('Inicio');
    elem.scrollIntoView({ behavior: 'smooth' });
  }

  public toggle(menu: HTMLElement) {
    const list = Array.prototype.slice.call(menu.children) as HTMLElement[];
    this.init = true;
    this.collapsed = !this.collapsed;

    gsap.to(menu, {
      translateY: 0,
      duration: 0.6,
    });
    this.animateElements(this.collapsed, list, menu);
  }

  private async animateElements(collapse: boolean, list: HTMLElement[], menu) {
    this.botonColores = true;
    if (collapse) {
      for (let i = 0; i < list.length; i++) {
        const sliced = list.slice(i, list.length);
        gsap.to(sliced, {
          translateY: 55 * i,
          delay: 0.3 * i,
          duration: 0.6,
        });
      }
      setTimeout(() => {
        this.botonColores = false;
      }, 1000);
    } else {
      gsap
        .to(list, {
          y: 0,
          duration: 0.3,
        })
        .then(() => {
          gsap.to(menu, {
            translateY: -80,
            duration: 0.3,
          });
          this.botonColores = false;
        });
    }
  }

  colorPurple(): void {
    this.themeService.setPurple();
  }

  colorGreen(): void {
    this.themeService.setGreen();
  }

  colorPink(): void {
    this.themeService.setPink();
  }

  stop(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}
