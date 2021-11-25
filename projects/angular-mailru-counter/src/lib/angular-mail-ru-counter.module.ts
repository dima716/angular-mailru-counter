import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Inject, ModuleWithProviders, NgModule, PLATFORM_ID} from '@angular/core';
import {AngularMailRuCounterConfiguration} from './angular-mail-ru-counter.models';
import {AngularMailRuCounterService} from './angular-mail-ru-counter.service';

@NgModule({
    declarations: [],
    imports: [CommonModule],
})
export class AngularMailRuCounterModule {
    private static config: AngularMailRuCounterConfiguration | null = null;

    constructor(
        private angularMailRuCounter: AngularMailRuCounterService,
        @Inject(PLATFORM_ID) platformId: Object,
    ) {
        if (!AngularMailRuCounterModule.config) {
            throw Error(
                'angular-mailru-counter not configured correctly. Pass the `counterId` property to the `forRoot()` function',
            );
        }

        if (AngularMailRuCounterModule.config.enabled && isPlatformBrowser(platformId)) {
            this.angularMailRuCounter.initialize();
        }
    }

    /**
     * Initialize the Angular Mail.ru Counter Module
     *
     * Add your Mail.ru Counter ID as parameter
     */
    static forRoot(
        config: AngularMailRuCounterConfiguration,
    ): ModuleWithProviders<AngularMailRuCounterModule> {
        this.config = config;

        const counterId = config.counterId;

        this.verifyCounterId(counterId);

        return {
            ngModule: AngularMailRuCounterModule,
            providers: [
                AngularMailRuCounterService,
                {provide: 'config', useValue: config},
            ],
        };
    }

    /**
     * Verifies the Counter ID that was passed into the configuration.
     * - Checks if Counter was initialized
     * @param counterId Counter ID to verify
     */
    private static verifyCounterId(counterId: string): void {
        if (counterId === null || counterId === undefined || counterId.length === 0) {
            throw Error(
                'Invalid Mail.ru Counter ID. Did you pass the ID into the forRoot() function?',
            );
        }
    }
}
