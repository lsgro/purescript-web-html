"use strict";

const elementMap = {
    "a": HTMLAnchorElement,
    "area": HTMLAreaElement,
    "audio": HTMLAudioElement,
    "base": HTMLBaseElement,
    "blockquote": HTMLQuoteElement,
    "body": HTMLBodyElement,
    "br": HTMLBRElement,
    "button": HTMLButtonElement,
    "canvas": HTMLCanvasElement,
    "caption": HTMLTableCaptionElement,
    "col": HTMLTableColElement,
    "colgroup": HTMLTableColElement,
    "data": HTMLDataElement,
    "datalist": HTMLDataListElement,
    "del": HTMLModElement,
    "details": HTMLDetailsElement,
    "div": HTMLDivElement,
    "dl": HTMLDListElement,
    "embed": HTMLEmbedElement,
    "fieldset": HTMLFieldSetElement,
    "form": HTMLFormElement,
    "h1": HTMLHeadingElement,
    "h2": HTMLHeadingElement,
    "h3": HTMLHeadingElement,
    "h4": HTMLHeadingElement,
    "h5": HTMLHeadingElement,
    "h6": HTMLHeadingElement,
    "head": HTMLHeadElement,
    "hr": HTMLHRElement,
    "html": HTMLHtmlElement,
    "iframe": HTMLIFrameElement,
    "img": HTMLImageElement,
    "input": HTMLInputElement,
    "ins": HTMLModElement,
    "label": HTMLLabelElement,
    "legend": HTMLLegendElement,
    "li": HTMLLIElement,
    "link": HTMLLinkElement,
    "map": HTMLMapElement,
    "menu": HTMLMenuElement,
    "meta": HTMLMetaElement,
    "meter": HTMLMeterElement,
    "object": HTMLObjectElement,
    "ol": HTMLOListElement,
    "optgroup": HTMLOptGroupElement,
    "option": HTMLOptionElement,
    "output": HTMLOutputElement,
    "p": HTMLParagraphElement,
    "param": HTMLParamElement,
    "picture": HTMLPictureElement,
    "pre": HTMLPreElement,
    "progress": HTMLProgressElement,
    "q": HTMLQuoteElement,
    "script": HTMLScriptElement,
    "select": HTMLSelectElement,
    "slot": HTMLSlotElement,
    "source": HTMLSourceElement,
    "span": HTMLSpanElement,
    "style": HTMLStyleElement,
    "SVG svg": SVGSVGElement,
    "table": HTMLTableElement,
    "tbody": HTMLTableSectionElement,
    "td": HTMLTableCellElement,
    "template": HTMLTemplateElement,
    "textarea": HTMLTextAreaElement,
    "tfoot": HTMLTableSectionElement,
    "th": HTMLTableCellElement,
    "thead": HTMLTableSectionElement,
    "time": HTMLTimeElement,
    "title": HTMLTitleElement,
    "tr": HTMLTableRowElement,
    "track": HTMLTrackElement,
    "ul": HTMLUListElement,
    "video": HTMLVideoElement    
};
        
function createCustomElementClass(
    parentElementClass,
    builder,
    onConnected,
    onDisconnected,
    onAdopted,
    onAttributeChanged,
    observedAttributes) {

    const elementClass = function() {
        const self = Reflect.construct(
            parentElementClass,
            [],
            elementClass
        );
        builder(self)();
        return self;
    }
    console.debug("Setting prototype:", parentElementClass);
    Object.setPrototypeOf(elementClass, parentElementClass);
    const elementPrototype = {
        constructor: elementClass,
        connectedCallback: onConnected,
        disconnectedCallback: onDisconnected,
        adoptedCallback: onAdopted,
        attributeChangedCallback: onAttributeChanged
    };
    console.debug("Setting prototype prototype:", parentElementClass.prototype);
    Object.setPrototypeOf(
        elementPrototype,
        parentElementClass.prototype);
    elementClass.prototype = elementPrototype;
    const observedAttributesGetter = function () {
        return observedAttributes;
    };
    Object.defineProperty(
        elementPrototype,
        'observedAttributes',
        { get: observedAttributesGetter }
    );
    return elementClass;
}

exports._createDerivedCustomElement = function(parentElementName) {
    return function (elementName) {
        return function (builder) {
            return function (onConnected) {
                return function (onDisconnected) {
                    return function (onAdopted) {
                        return function (onAttributeChanged) {
                            return function (observedAttributes) {
                                return function() {
                                    const parentElementClass = elementMap[parentElementName];
                                    if (!parentElementClass) {
                                        parentElementClass = HTMLElement;
                                    }
                                    const elementClass = createCustomElementClass(
                                        parentElementClass,
                                        builder,
                                        onConnected,
                                        onDisconnected,
                                        onAdopted,
                                        onAttributeChanged,
                                        observedAttributes
                                    );
                                    customElements.define(elementName, elementClass, { extends: parentElementName });
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};

exports._createAutonomousCustomElement = function (elementName) {
    return function (builder) {
        return function (onConnected) {
            return function (onDisconnected) {
                return function (onAdopted) {
                    return function (onAttributeChanged) {
                        return function (observedAttributes) {
                            return function() {
                                const elementClass = createCustomElementClass(
                                    HTMLElement,
                                    builder,
                                    onConnected,
                                    onDisconnected,
                                    onAdopted,
                                    onAttributeChanged,
                                    observedAttributes
                                );
                                customElements.define(elementName, elementClass);
                            };
                        };
                    };
                };
            };
        };
    };
};
