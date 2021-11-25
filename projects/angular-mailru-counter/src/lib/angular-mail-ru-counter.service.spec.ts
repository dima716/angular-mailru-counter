import {TestBed} from '@angular/core/testing';
import {AngularMailRuCounterConfig} from './angular-mail-ru-counter-config';
import {AngularMailRuCounterService} from './angular-mail-ru-counter.service';

describe('AngularMailRuCounterService', () => {
    let service: AngularMailRuCounterService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{provide: AngularMailRuCounterConfig, useValue: {}}],
        });
        service = TestBed.inject(AngularMailRuCounterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
