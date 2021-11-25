import {Injectable} from '@angular/core';

@Injectable()
export class AngularMailRuCounterConfig {
    /** Whether to start tracking immediately. Default is `false` */
    enabled?: boolean;
    /** Your Mail.ru Counter ID */
    counterId!: string;
}
