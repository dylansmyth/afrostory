import React, { useEffect, useState } from 'react';
import { Dimensions, Image, SafeAreaView, View, Text, StyleSheet, Button, ActivityIndicator, AsyncStorage, TouchableOpacity } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';

const AppButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
);

const AboutScreen = ({ navigation}) => {
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Image 
                style={styles.logo} source={require("../assets/afrostoryLogoWhite.jpg")}
                resizeMode="contain" />
                
                <View style={styles.borderLine}></View>
                <Text style={styles.titleText}>ABOUT</Text>
                {/* <Text style={styles.sloganText}>Write your own story</Text> */}
                <Text style={styles.descriptionText}>
                We are inspired to put a billion books in
                African households where there were none or
                few before, and a Black author-focused
                library in every home. In South Africa alone,
                the MAJORITY of people have no books in
                their homes at all, and even fewer schools
                have libraries, for example.
                We are an African business. We are an
                Ethical business. We are launching our first
                product that will change millions of lives,
                providing a unique set of literature with easy
                access to African history, heritage and stories
                to inspire, educate and entertain us all. With our high volume,
                low price model, with capped profits, heavy
                marketing focus, and prices that never go up,

ethics are our core.
                </Text>
                <View style={styles.borderLine}></View>
                <Text style={styles.titleText}>DISCLAIMER</Text>
                <Text style={styles.disclaimerText}>
                    This is to our knowledge (and following our own desktop research) a 
                    public domain book and thus we are free to distribute it in this form and format. 
                    Please direct any queries to us at www.afrostory.org and we will attend to them as 
                    quickly as we can. Sincerely, Team AfroStory (: Let's get Africa reading more 
                    together and as one! The contents are free to enjoy. The lists of literature, 
                    sub-lists of literature, and App itself including design, function and concept 
                    are copyrighted Intellectual Property owned by: 
                    AfroStory (Pty) Ltd. 2020. Registered in South Africa. All rights reserved.

                </Text>
                
            </ScrollView>

            <AppButton title="Library" onPress={() => navigation.navigate("Home")} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    titleText: {
        fontWeight: "bold",
        fontSize: 40,
        color: "#ee5535",
        paddingBottom: 10,
        alignSelf: "center"
        
    },
    sloganText: {
        fontWeight: "bold",
        fontSize: 30,
        color: "#FFFFFF",
        textTransform: "uppercase",
        fontStyle: "italic",
        paddingBottom: 10,
        paddingTop: 10
    
    },
    borderLine: {
        borderBottomColor: "#FFFFFF",
        borderBottomWidth: 1,
        padding: 10,
        paddingBottom: 10,
        marginBottom: 20
    },
    descriptionText: {
        color: "#C0C0C0",
        fontSize: 15,
        alignSelf: "center",
    },
    disclaimerText: {
        color: "#C0C0C0",
        fontSize: 15,
        alignSelf: "center",
        paddingBottom: 10,
    },
    footerText: {
        color: "gray",
        fontSize: 15,
        alignSelf: "center",
        paddingTop: 10,
        fontStyle: "italic"
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "black",
        
        
    },

    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#ee5535",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 10
   
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    logo: {
        width: Dimensions.get('screen').width - 30,
        height: 50
    }
    
})
export default AboutScreen;