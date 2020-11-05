import React from 'react';
import { ImageBackground, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';



const AppButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
);

const WelcomeScreen = ({ navigation }) => {
    return (
        <TouchableOpacity 
            style={styles.background}
            onPress={() => navigation.navigate("Home")}
        >
                

            <ImageBackground 
                style={styles.backgroundImage} 
                source={require("../assets/loadingScreenPic.jpg")}
                imageStyle={{ resizeMode: 'cover' }}
            >
                {/* <View style={styles.centerContentImage}>

                    <Image 
                        style={styles.logo} source={require("../assets/transparentLogo2.png")}
                        resizeMode="contain" 
                    />
                    
                    
                        

                    
                </View>
                <View style={styles.centerContentText}>
                    <Text style={styles.click}>Click anywhere to continue...</Text>
                </View> */}
                
               

            </ImageBackground>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        

    },
    backgroundImage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    enterButton: {
        width: "100%",
        height: 70,
        backgroundColor: "goldenrod",
        alignItems: "center"
    },
    
    enterButtonText: {
        fontSize: 30,
        fontWeight: "bold",
        fontStyle: "normal",
        top: 10
    },
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "goldenrod",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 20,
        
        
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    screenContainer: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 16,
        alignSelf: "stretch"

    },
    logo: {
        
        width: 300,
        height: 300,
        
    },
    click: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#FFFFFF",
        paddingBottom: 10,
    },
    centerContentImage: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 250,
        paddingLeft: 15
    },
    slogan: {
        fontWeight: "bold",
        fontSize: 15,
        color: "#FFFFFF",
        textTransform: "uppercase",
        fontStyle: "italic"
    }
})

export default WelcomeScreen;