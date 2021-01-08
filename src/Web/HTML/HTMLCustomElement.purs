module Web.HTML.HTMLCustomElement (
    Constructor,
    OnStateChange,
    OnAttributeChange,
    ObservedAttributes,
    CustomElementInit,
    Method,
    PropertyOps,
    defaultBuilder,
    defaultOnStateChanged,
    defaultOnAttributeChanged,
    defaultObservedAttributes,
    defaultCustomElementInit,
    createCustomElement,
    setProperty,
    getProperty,
    addManagedProperty,
    addMethod,
    makeCustomEvent
) where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import Web.Event.CustomEvent (CustomEvent)
import Web.HTML.HTMLElement (HTMLElement)

type Constructor = HTMLElement -> Effect Unit

type OnStateChange = HTMLElement -> Effect Unit

type OnAttributeChange = HTMLElement -> String -> String -> String -> Effect Unit

type ObservedAttributes = Array String

type Method a b = a -> HTMLElement -> Effect b

type PropertyOps a = {
    getter :: Method Unit a,
    setter :: Method a Unit
}

type CustomElementInit = {
    extends :: Maybe String,
    constructor :: Constructor,
    onConnected :: OnStateChange,
    onDisconnected :: OnStateChange,
    onAdopted :: OnStateChange,
    onAttributeChanged :: OnAttributeChange,
    observedAttributes :: ObservedAttributes
}

makeCustomEvent :: forall a. String -> Maybe a -> Effect CustomEvent
makeCustomEvent name (Just detail) = _makeCustomEventWithDetail name detail
makeCustomEvent name Nothing = _makeCustomEvent name

foreign import _makeCustomEventWithDetail :: forall a. String -> a -> Effect CustomEvent
foreign import _makeCustomEvent :: String -> Effect CustomEvent

defaultBuilder :: Constructor
defaultBuilder _ = pure unit

defaultOnStateChanged :: OnStateChange
defaultOnStateChanged _ = pure unit

defaultOnAttributeChanged :: OnAttributeChange
defaultOnAttributeChanged _ _ _ _ = pure unit

defaultObservedAttributes :: ObservedAttributes
defaultObservedAttributes = []

defaultCustomElementInit :: CustomElementInit
defaultCustomElementInit = {
    extends: Nothing,
    constructor: defaultBuilder,
    onConnected: defaultOnStateChanged,
    onDisconnected: defaultOnStateChanged,
    onAdopted: defaultOnStateChanged,
    onAttributeChanged: defaultOnAttributeChanged,
    observedAttributes: defaultObservedAttributes
}

createCustomElement :: String -> CustomElementInit -> Effect Unit
createCustomElement elementName props =
    case props.extends of
        Just parentElementName -> _createDerivedCustomElement
            parentElementName
            elementName
            props.constructor
            props.onConnected
            props.onDisconnected
            props.onAdopted
            props.onAttributeChanged
            props.observedAttributes
        Nothing -> _createAutonomousCustomElement
            elementName
            props.constructor
            props.onConnected
            props.onDisconnected
            props.onAdopted
            props.onAttributeChanged
            props.observedAttributes

foreign import setProperty :: forall a. String -> a -> HTMLElement -> Effect Unit
foreign import getProperty :: forall a. String -> HTMLElement -> Effect a

foreign import addManagedProperty :: forall a. String -> PropertyOps a -> HTMLElement -> Effect Unit

foreign import addMethod :: forall a b. String -> Method a b -> HTMLElement -> Effect Unit

foreign import _createDerivedCustomElement :: String
    -> String
    -> Constructor 
    -> OnStateChange 
    -> OnStateChange 
    -> OnStateChange 
    -> OnAttributeChange
    -> ObservedAttributes
    -> Effect Unit

foreign import _createAutonomousCustomElement :: String 
    -> Constructor 
    -> OnStateChange 
    -> OnStateChange 
    -> OnStateChange 
    -> OnAttributeChange
    -> ObservedAttributes
    -> Effect Unit