import { View, StyleSheet, Text, Image, ScrollView, Dimensions, ActivityIndicator, BackHandler, Alert, TouchableOpacity } from "react-native"
import DetailBirdHeaderBar from "../headerBars/DetailBirdHeaderBar"
import { useEffect, useState } from "react"
import { calculateOptimizedImageSize } from "../imageSizesOptimizer/imageSizesOptimizer"
import TextInDetailBird from "./TextInDetailBird"
import MapViewInDetailBird from "./MapViewInDetailBird"
import { changeDateFormatToDDMMYYYY } from "../utils/utils"
import DeleteBirdButton from "./DeleteBirdButton"
import EditBirdButton from "./EditBirdButton"
import { useRoute } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"
import { useIsFocused } from "@react-navigation/native"
import { useGlobalContext } from "../globalContext/GlobalContext"
import FullScreenImageModal from "./FullScreenImageModal"
import { calculateFullScreenImageSize } from "../imageSizesOptimizer/imageSizesOptimizer"
import CommentSection from "./CommentSection"

const windowWidth = Dimensions.get('window').width

function BirdDetailPageWithoutAuthor(){
    const { globalVariable, setGlobalVariable } = useGlobalContext()
    const navigation = useNavigation()
    const route = useRoute()
    const props = route.params
    const isFocused = useIsFocused()

    const [birdData, setBirdData] = useState([])
    const [isLoadingBirdData, setIsLoadingBirdData] = useState(true)
    const [birdImageWidth, setBirdImageWidth] = useState(0)
    const [birdImageHeight, setBirdImageHeight] = useState(0)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [fullScreenBirdImageHeight, setFullScreenBirdImageHeight] = useState(0)
    const [fullScreenBirdImageWidth, setFullScreenBirdImageWidth] = useState(0)

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
        );
    
        return () => backHandler.remove()
    }, [])
      
    const handleBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true
        }
        return false
    }


    useEffect(() => {
        setIsLoadingBirdData(true)
        calculateOptimizedImageSize(globalVariable.API_URL + 'getbird/' + props.id + '/' + props.loggedUsername + '?' + Math.random(10), 20, setBirdImageWidth, setBirdImageHeight)
        calculateFullScreenImageSize(globalVariable.API_URL + 'getbird/' + props.id + '/' + props.loggedUsername, setFullScreenBirdImageWidth, setFullScreenBirdImageHeight)
        if(isFocused){
            fetchData()
        }
    }, [isFocused])

    const fetchData = async () => {
        try {
            const response = await fetch(globalVariable.API_URL + 'getbird/' + props.id + '/' + props.loggedUsername  + '?' + Math.random(10))
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const imageMetadata = JSON.parse(response.headers.get('imageInfos'))
            setBirdData(imageMetadata)

            setIsLoadingBirdData(false)
        } catch (error) {
          console.error('Bird detail page without author Error on getting the datas:', error)
          setIsLoadingBirdData(false)
        }
    }

    const imageSizeStyle = {
        width: birdImageWidth || 200,
        height: birdImageHeight || 200,
    }

    async function deleteBird(){
        await fetch(globalVariable.API_URL + 'deletebird/' + birdData.id)
        navigation.goBack()
    }

    function handleDeletePress(){
        Alert.alert(
            'Delete Bird',
            'Are you sure you want to delete this bird?',
            [
              { text: 'Cancel'},
              { text: 'OK', onPress: () => deleteBird() },
            ],
            { cancelable: true }
          );
    }

    function handleEditBirdPress(){
        navigation.navigate('EditBird', { loggedUsername: props.loggedUsername, birdData: birdData, })
    }

    function closeFullScreenImageModal(){
        setIsModalVisible(false)
    }
      
    function getBirdDetails(){
        return(
            <>
                {
                    isModalVisible ?
                    <FullScreenImageModal 
                        image={globalVariable.API_URL + 'getbird/' + props.id + '/' + props.loggedUsername + '?' + Math.random(10)} 
                        width={fullScreenBirdImageWidth} 
                        height={fullScreenBirdImageHeight}
                        closeModal={closeFullScreenImageModal}
                    />
                    :
                    null
                }
                <View style={[styles.pageContainer, {backgroundColor: globalVariable.backgroundColor}]}>
                    <View style={styles.headerContainer}>
                    <DetailBirdHeaderBar 
                        id={birdData.id} 
                        birdName={birdData.name} 
                        loggedUsername={props.loggedUsername} 
                        onBackButtonPress={() => navigation.goBack()} 
                        likes={birdData.likes} 
                        userPutLike={birdData.userPutLike}
                    />
                    </View>
                    <ScrollView>
                        {
                            birdData.id === -1 ? null : (
                                <View style={styles.imageContainer}>
                                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                                        <Image source={{ uri: globalVariable.API_URL + 'getbird/' + props.id + '/' + props.loggedUsername + '?' + Math.random(10) }} style={[styles.birdImage, imageSizeStyle]} />
                                    </TouchableOpacity>
                                </View>
                            )
                        }

                        <View style={styles.textContainer}>
                            <TextInDetailBird sightingDate={changeDateFormatToDDMMYYYY(birdData.sightingDate)} personalNotes={birdData.personalNotes}/>
                        </View>
                        <MapViewInDetailBird xPosition={birdData.xPosition} yPosition={birdData.yPosition}/>
                        {
                            props.originPage === "Encyclopedia"
                            ?
                            <View style={styles.rowContainer}>
                                <DeleteBirdButton handleDeletePress={handleDeletePress} />
                                <EditBirdButton handleDeletePress={handleEditBirdPress } />
                            </View>
                            : null
                        }
                        <View style={styles.textContainer}>
                            <Text style={[styles.boldText, {paddingBottom: 10}]}>Comments section:</Text>
                            <CommentSection bird={props.id} loggedUsername={props.loggedUsername}/>
                        </View>
                    </ScrollView>
                </View>
            </>
        )
    }

    return (
        <>
            {
                isLoadingBirdData ?
                <View style={[styles.loadingContainer, {backgroundColor: globalVariable.backgroundColor}]}>
                    <ActivityIndicator size="large"  color="#0000ff"/>
                </View>
                :
                getBirdDetails()
            }
        </>
      )
}

export default BirdDetailPageWithoutAuthor

const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    android: {
        elevation: 5,
    },
    default: {},
})

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
    },
    headerContainer: {
        height: 70,
    },
    pressableAuthorContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        padding: 20,
        ...shadowStyle
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    birdImage: {
        borderRadius: 10,
        width: windowWidth - 50, 
        height: windowWidth - 110, // L'altezza sarà il 50% della larghezza per mantenere l'aspect ratio
        borderRadius: 10,
    },
    imageContainer:{
        ...shadowStyle,
        backgroundColor:'black',
        borderRadius: 10,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        padding: 20,
        ...shadowStyle
    },
    rowContainer: {
        flexDirection: 'row',
    },
})