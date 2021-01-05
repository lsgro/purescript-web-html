module Web.HTML.HTMLCustomElement (
    Builder,
    OnStateChange,
    OnAttributeChange,
    ObservedAttributes,
    CustomElementProperties,
    defaultBuilder,
    defaultOnStateChanged,
    defaultOnAttributeChanged,
    defaultObservedAttributes,
    defaultCustomElementProperties,
    createCustomElement
) where

import Prelude
import Effect (Effect)
import Web.HTML.HTMLElement (HTMLElement)

type Builder = HTMLElement -> Effect Unit

type OnStateChange = HTMLElement -> Effect Unit

type OnAttributeChange = HTMLElement -> String -> String -> String -> Effect Unit

type ObservedAttributes = Array String

type CustomElementProperties = {
    builder :: Builder,
    onConnected :: OnStateChange,
    onDisconnected :: OnStateChange,
    onAdopted :: OnStateChange,
    onAttributeChanged :: OnAttributeChange,
    observedAttributes :: ObservedAttributes
}

defaultBuilder :: Builder
defaultBuilder _ = pure unit

defaultOnStateChanged :: OnStateChange
defaultOnStateChanged _ = pure unit

defaultOnAttributeChanged :: OnAttributeChange
defaultOnAttributeChanged _ _ _ _ = pure unit

defaultObservedAttributes :: ObservedAttributes
defaultObservedAttributes = []

defaultCustomElementProperties :: CustomElementProperties
defaultCustomElementProperties = {
    builder: defaultBuilder,
    onConnected: defaultOnStateChanged,
    onDisconnected: defaultOnStateChanged,
    onAdopted: defaultOnStateChanged,
    onAttributeChanged: defaultOnAttributeChanged,
    observedAttributes: defaultObservedAttributes
}

foreign import _createCustomElement :: String 
    -> Builder 
    -> OnStateChange 
    -> OnStateChange 
    -> OnStateChange 
    -> OnAttributeChange
    -> ObservedAttributes
    -> Effect Unit

createCustomElement :: String -> CustomElementProperties -> Effect Unit
createCustomElement elementName props = 
    _createCustomElement 
        elementName
        props.builder
        props.onConnected
        props.onDisconnected
        props.onAdopted
        props.onAttributeChanged
        props.observedAttributes
