import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, Button} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { approximateNumberOfDays, calculateDifferenceBetweenTwoDates } from "./itemsUtils/FriendItemUtils"
import { useGlobalContext } from "../globalContext/GlobalContext";

function BirdItemLatestSightings(props) {
    const today = new Date()
    const [liked, setLiked] = useState(props.userPutLike)
    const [likeNumber, setLikeNumber] = useState(props.likes)
    const { globalVariable, setGlobalVariable } = useGlobalContext()

    useEffect(() => {
        setLiked(props.userPutLike)
        setLikeNumber(props.likes)
    }, [props.userPutLike, props.likes])

    function addLikeHandler(){
        if(props.addLike)//This function is used to add the like also in the detail user page. If the user is not coming from the detail user page, I do nothing
            props.addLike()

    }

    function removeLikeHandler(){
        if(props.removeLike)//This function is used to remove the like also in the detail user page. If the user is not coming from the detail user page, I do nothing
            props.removeLike()
    }

    async function onPressLikeHandler(){
        const newValue = !liked
        setLiked(newValue)
        if(newValue === true){
            addLikeHandler()
            setLikeNumber(likeNumber + 1)
            await fetch(globalVariable.API_URL + 'addlike', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: props.loggedUsername, bird: props.id })
            });
        }else{
            removeLikeHandler()
            setLikeNumber(likeNumber - 1)
            await fetch(globalVariable.API_URL + 'removelike', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: props.loggedUsername, bird: props.id })
            });
        }
    }

    function onBirdPressedHandler(){
        props.onBirdPressed(props.id)
    }

    return (
        <View style={styles.birdItem}>
            <Pressable 
                style={({pressed}) => pressed && styles.pressedItem}
                onPress={onBirdPressedHandler}
            >
                <View style={styles.itemContent}>
                    <Image
                        source={props.image}
                        style={styles.avatar}
                    />
                    <View style={styles.nameAndAuthor}>
                        <Text style={styles.birdName}>{props.name}</Text>
                        <Text style={styles.text}>{approximateNumberOfDays(calculateDifferenceBetweenTwoDates(today, props.sightingDate))}</Text>
                        <Text style={styles.text14}>{props.distance} km {props.defaultPosition ? 'from your default position' : 'from your actual position'}</Text>
                    </View>
                    <Pressable onPress={() => onPressLikeHandler()}>
                        <View style={styles.heartContainer}>
                            <Text style={styles.likesNumber}>{likeNumber}</Text>
                                <MaterialCommunityIcons
                                    name={liked ? "heart" : "heart-outline"}
                                    size={32}
                                    color={liked ? "red" : "black"}
                                />
                        </View>
                    </Pressable>
                </View>
            </Pressable>
        </View>
    )
}

export default BirdItemLatestSightings

const styles = StyleSheet.create({
    birdItem: {
        flex: 1,
        margin: 5,
        marginBottom: 10,
        borderRadius: 6,
        backgroundColor: 'white',
    },
    birdName: {
        color: 'black',
        paddingTop: 8,
        paddingLeft: 8,
        fontSize: 19,
        fontWeight: 'bold',
    },
    text: {
        color: 'black',
        paddingLeft: 8,
        fontSize: 15,
    },
    text14: {
        color: 'black',
        paddingLeft: 8,
        fontSize: 14,
    },
    pressedItem: {
        opacity: 0.5,
        backgroundColor: '#d3d3d3',
        borderRadius: 10,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 100,
        marginLeft: 5,
        marginTop: 5,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nameAndAuthor: {
       flex: 1
    }, 
    heartContainer : {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 10,
        flexDirection: 'row',
    },
    likesNumber: {
        fontSize: 17,
        paddingRight: 4,
        paddingTop: 3,
    }
})