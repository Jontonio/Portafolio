import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio/inicio.component';
import { AboutComponent } from './about/about.component';
import { SkillComponent } from './skill/skill.component';
import { QualificationComponent } from './qualification/qualification.component';

@NgModule({
  declarations: [
    InicioComponent,
    AboutComponent,
    SkillComponent,
    QualificationComponent
  ],
  imports: [CommonModule],
  exports: [
    InicioComponent,
    AboutComponent,
    SkillComponent,
    QualificationComponent
  ],
})
export class PagesModule {}
