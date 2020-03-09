import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainJourneyComponent } from 'components/train-journey-planner/train-journey-planner.component';

describe('train-journey-planner.component', () => {
  let component: TrainJourneyComponent;
  let fixture: ComponentFixture<TrainJourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainJourneyComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display a title', async(() => {
    const titleText = fixture.nativeElement.querySelector('h1').textContent;
    expect(titleText).toEqual('Train Journey Planner');
  }));


});
