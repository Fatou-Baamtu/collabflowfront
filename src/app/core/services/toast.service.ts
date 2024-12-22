import { Injectable, ComponentRef, ApplicationRef, ComponentFactoryResolver, Injector, EmbeddedViewRef, Type } from '@angular/core';
import {ToastComponent} from '../../shared/components/ui/toast/toast.component';
import {ToastData} from '../interfaces/toast.interface';


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: ComponentRef<ToastComponent>[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  show(data: ToastData) {
    // Créer une instance du composant
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(ToastComponent)
      .create(this.injector);

    // Définir les données
    componentRef.instance.data = {
      id: Math.random().toString(36).substr(2, 9),
      duration: 3000,
      variant: 'default',
      ...data
    };

    // Attacher le composant à l'application
    this.appRef.attachView(componentRef.hostView);

    // Obtenir le DOM element
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
    document.body.appendChild(domElem);

    // Stocker la référence
    this.toasts.push(componentRef);

    // Nettoyer après la fermeture
    setTimeout(() => {
      const index = this.toasts.indexOf(componentRef);
      if (index > -1) {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
        this.toasts.splice(index, 1);
      }
    }, data.duration || 3000);
  }

  success(message: string, title?: string) {
    this.show({
      title,
      description: message,
      variant: 'success'
    });
  }

  error(message: string, title?: string) {
    this.show({
      title,
      description: message,
      variant: 'error'
    });
  }

  warning(message: string, title?: string) {
    this.show({
      title,
      description: message,
      variant: 'warning'
    });
  }

  info(message: string, title?: string) {
    this.show({
      title,
      description: message,
      variant: 'info'
    });
  }
}
