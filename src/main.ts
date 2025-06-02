import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter} from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot({})),
    provideHttpClient(),
    provideRouter(routes),
    //Se inicia Firebase con la configuración del entorno
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    //Para utilizar Firebase en tiempo real
    provideFirestore(() => getFirestore()),
    //Para utilizar la autenticación de Firebase
    provideAuth(() => getAuth()),
  ],
});
