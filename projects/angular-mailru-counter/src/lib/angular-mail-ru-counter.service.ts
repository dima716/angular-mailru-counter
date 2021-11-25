import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {
    Inject,
    Injectable,
    PLATFORM_ID,
    Renderer2,
    RendererFactory2,
} from '@angular/core';
import {AngularMailRuCounterConfig} from './angular-mail-ru-counter-config';

declare const _tmr: any;

@Injectable({
    providedIn: 'root',
})
export class AngularMailRuCounterService {
    private renderer: Renderer2;
    private doc: Document;

    constructor(
        @Inject(DOCUMENT) private documentRef: any,
        @Inject(PLATFORM_ID) private platformId: Object,
        private rendererFactory: RendererFactory2,
        private config: AngularMailRuCounterConfig,
    ) {
        this.doc = this.documentRef as Document;
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    /**
     * Initialize Mail.ru Counter tracking script
     * - Adds the script to page's head
     * - Tracks first page view
     */
    initialize(counterId: string = this.config.counterId): void {
        if (this.isLoaded()) {
            console.warn(
                'Tried to initialize a Mail.Ru Counter instance while another is already active. Please call `remove()` before initializing a new instance.',
            );

            return;
        }

        this.config.enabled = true;
        this.addMailRuCounterScript(counterId);
    }

    /** Remove the Mail.ru Counter tracking script */
    remove(): void {
        this.removeMailRuCounterScript();
        this.config.enabled = false;
    }

    /**
     * Track a goal
     *
     * See {@link https://target.my.com/help/advertisers/sourcetopmailru/en#goals MyTarget docs - Set goals for the counter}
     * @param goal The name of the goal that is being tracked
     * @param value A fixed number attached to a specific goal
     */
    trackGoal(goal: string, value?: number): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        if (!this.isLoaded()) {
            console.warn(
                'Tried to track an event without initializing a Mail.Ru Counter instance. Call `initialize()` first.',
            );

            return;
        }

        _tmr.push({
            type: 'reachGoal',
            id: this.config.counterId,
            goal,
            ...(value && Number.isInteger(value) && {value}),
        });
    }

    /**
     * Adds Mail.ru Counter tracking script to the application
     * @param counterId Mail.ru Counter ID to use
     */
    private addMailRuCounterScript(counterId: string): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const counterCode = `
       var _tmr = window._tmr || (window._tmr = []);
       _tmr.push({id: "${counterId}", type: "pageView", start: (new Date()).getTime()});
       (function (d, w, id) {
         if (d.getElementById(id)) return;
         var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
         ts.src = "https://top-fwz1.mail.ru/js/code.js";
         var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
         if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
       })(document, window, "topmailru-code");`;

        const scriptElement = this.renderer.createElement('script');

        this.renderer.setAttribute(scriptElement, 'id', 'mail-ru-counter-script');
        this.renderer.setAttribute(scriptElement, 'type', 'text/javascript');
        this.renderer.setProperty(scriptElement, 'innerHTML', counterCode);
        this.renderer.appendChild(this.doc.head, scriptElement);
    }

    /** Remove Mail.ru Counter tracking script from the application */
    private removeMailRuCounterScript(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const mailRuCounterElement = this.doc.getElementById('mail-ru-counter-script');

        if (mailRuCounterElement) {
            mailRuCounterElement.remove();
        }
    }

    /** Checks if the script element is present */
    private isLoaded(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            const mailRuCounterElement = this.doc.getElementById(
                'mail-ru-counter-script',
            );

            return !!mailRuCounterElement;
        }

        return false;
    }
}
