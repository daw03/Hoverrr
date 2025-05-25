import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinecreatedComponent } from './minecreated.component';

describe('MinecreatedComponent', () => {
  let component: MinecreatedComponent;
  let fixture: ComponentFixture<MinecreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinecreatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinecreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
