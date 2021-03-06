import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { TornadorFloat } from './FloatCentral'

function UUID() {
    return Math.random().toString(32) + Date.now().toString(32)
}

const ModalView = React.memo((props: {
    children: any;
    zIndex: number;
    animation?: "opacity" | "none";
    onDidShow?: () => void;
    onDidHide?: () => void;
}) => {
    const { children, zIndex, onDidShow, onDidHide, animation = "none" } = props;
    useEffect(() => {
        if (onDidShow) onDidShow();
        return () => {
            if (onDidHide) onDidHide();
        }
    }, [])

    return (
        <Animated.View
            entering={animation == "none" ? undefined : FadeIn}
            exiting={animation == "none" ? undefined : FadeOut}
            style={[StyleSheet.absoluteFill, { zIndex, flex: 1 }]}>
            {children}
        </Animated.View>
    )
})

const FloatModal = React.memo((props: {
    visible: boolean;
    uuid?: string;
    children?: any;
    zIndex?: number;
    animation?: "opacity" | "none";
    onDidShow?: () => void;
    onDidHide?: () => void;
}) => {

    const { children, uuid, zIndex = 10000, visible, onDidShow, onDidHide, animation } = props;

    const KEY = useRef(uuid ?? UUID()).current;

    useEffect(() => {
        if (!global.makeFloat) return;
        if (visible) {
            let float: TornadorFloat.Float = {
                key: KEY,
                component: (props) => (
                    <ModalView
                        zIndex={zIndex}
                        onDidHide={onDidHide}
                        onDidShow={onDidShow}
                        animation={animation}
                        {...props}>
                        {children}
                    </ModalView>
                )
            }
            global.makeFloat(float, false)
        } else {
            global.makeFloat({ key: KEY }, true)
        }
    }, [visible, children])

    return <></>
});

export default FloatModal;