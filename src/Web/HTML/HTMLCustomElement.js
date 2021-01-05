"use strict";

exports._createCustomElement = function (elementName) {
    return function (builder) {
        return function (onConnected) {
            return function (onDisconnected) {
                return function (onAdopted) {
                    return function (onAttributeChanged) {
                        return function (observedAttributes) {
                            return function () {
                                const CustomEl = function() {
                                    const self = Reflect.construct(
                                        HTMLElement,
                                        [],
                                        CustomEl
                                    );
                                    builder(self)();
                                    return self;
                                }
                                Object.setPrototypeOf(CustomEl, HTMLElement);
                                const CustomElProto = {
                                    constructor: CustomEl,
                                    connectedCallback: onConnected,
                                    disconnectedCallback: onDisconnected,
                                    adoptedCallback: onAdopted,
                                    attributeChangedCallback: onAttributeChanged
                                };
                                Object.setPrototypeOf(
                                    CustomElProto,
                                    HTMLElement.prototype);
                                CustomEl.prototype = CustomElProto;
                                const observedAttributesGetter = function () {
                                    return observedAttributes;
                                };
                                Object.defineProperty(
                                    CustomElProto,
                                    'observedAttributes',
                                    { get: observedAttributesGetter }
                                );
                                customElements.define(elementName, CustomEl);
                            };
                        };
                    };
                };
            };
        };
    };
};