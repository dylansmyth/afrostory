import React, { useEffect, useState, createRef }  from 'react';
import { Image, ScrollView, FlatList, Button, StyleSheet, View, Text, ActivityIndicator, SafeAreaView, AsyncStorage, Dimensions } from 'react-native';





let isFetching = true;
let isDone = false;
let globalXOffset = 0;
function setFetching(value) {
    isFetching = value;
}

const fetchContent = (id, status, title, author, year, contentArr, pageNumber, authorOrigin, genre) => {
    
    
    if(contentArr.length == 0) {
        isDone = false;
    }
    
    let whereFrom = "fetch";
    if(status == "stored") {
        whereFrom = "async";
    }
    
    const [isLoading, setLoading] = useState(true);
    try {
        
        useEffect(() => {
            getData(whereFrom, id, title, author, year, contentArr)
            .catch(function(error) {
                console.log("caught this");
                
            })
            .finally(() => setLoading(false));
        }, []);
    }
    catch(error) {
        console.log("caught this here");
    }
    
    if(!isLoading && !isFetching && contentArr.length > 0) {
        
        isDone = true;

    }
    return (
        
            !isDone ? <ActivityIndicator /> :(
                
                paginateData(contentArr[0]["content"], contentArr[0]["pageNumber"], id, author, year, title, authorOrigin, genre)
            )
        
    )
}

const getData = async(whereFrom, id, title, author, year, contentArr) => {

    if(whereFrom == "async") {
        let cArr = [];
        try {

            let contentAsync = await AsyncStorage.getItem(id + "content");
            let pageNumberAsync = await AsyncStorage.getItem(id + "pageNumber");
            let pageNumber = 0;
            if(pageNumberAsync !== null) {
                pageNumber = JSON.parse(pageNumberAsync); 
            }
            
            
            let content = JSON.parse(contentAsync);
            cArr.push(content);
            contentArr.push(
                {
                    id: id,
                    title: title,
                    content: cArr,
                    author: author,
                    year: year,
                    pageNumber: pageNumber
                }
            );
            setFetching(false);
        }
        catch(error) {
            alert(error);
        }
    }
    else {
        
        try {
            const uri = `http://afrostoryapibooks-env.eba-dm7hpfam.us-east-2.elasticbeanstalk.com/books/content/${id}`;
            await fetch(uri)
            .then((response) => response.json())
            
            
            .then((json) => contentArr.push(
                {
                    id: id,
                    title: title,
                    content: [json[0]["Text"]],
                    author: author,
                    year: year
                }))         
            .catch((error) => console.error(error))
            .finally(() => setFetching(false));
        }
        catch(error) {
            console.log("Network request failed.");

        }
  
    }
}


const constructPages = (data, wordsNumber) => {

    const splitString = (str, splitLength) => {
        let a = str.split(' '), b = [];
        while(a.length) b.push(a.splice(0,splitLength).join(' '));
        return b;
    }
    let words = splitString(data[0],wordsNumber);
    

    return words;
}
let wordNumber = 10;

const paginateData = (data, pageNumber, id, author, year, title, authorOrigin, genre) => {
    console.log("data from book", data);
    let words = data[0].match(/(.*?\s){250}/g);
    //let words = data[0].split(" ", data[0].length);
    
    let dimensionsWidth = undefined;
    let dimensionsHeight = 0;
    let dimensionReady = true;
    
    let pages = [];
    let intro = [author, authorOrigin, year, genre, title];
    pages.push (
        {   
            //key: "x",
            pageNumber: "x",
            pageContent: intro
        }
    )
     for(let i = 0; i < words.length; i++) {
        let id = i.toString();
        let idString = i.toString();
        //console.log("ID: ", id)
        pages.push (
            {  
                //key: id,
                pageNumber: i + 1,
                pageContent: words[i] 
            }
        ) 

     }
     let pageWords = constructPages(data, wordNumber);
     return (
        !dimensionReady ? (
            
            <View onLayout={(e) => {
            
                //pageWords = constructPages(data, 50);
                let viewSize = e.nativeEvent.layout;
                
                dimensionsHeight = viewSize.height;
                if (viewSize.height < Dimensions.get('screen').height) {
                    
                    wordNumber +=10;
                    
                    
                    
                }
                else{
                    
                    dimensionReady = true;
                }
                

            }}>
                <Text
                    onTextLayout={ (e) => {
                        const { lines } = e.nativeEvent;
                        
                    } }
                >
                    {pageWords[0]}
                </Text>
            </View>
            
        )
        :
        (
            renderFlatList(pages, pageNumber, id)
        )
        

        
     )
}
let flatlist = createRef();


const renderFlatList = (data, pageNumber, id) => {
    let widthD = 0;
    let layoutWidth = 0;
    let layoutOffset = 0;
    
    async function getPageNum() {
        let pageNum = await AsyncStorage.getItem(id + "pageNumber");
        return pageNum;
    }
    
    let getItemLayout;
    function onScrollEnd(e) {
        let contentOffset = e.nativeEvent.contentOffset;
        
        let viewSize = e.nativeEvent.layoutMeasurement;
        layoutWidth = viewSize.width;
        layoutOffset = contentOffset.x;
        
        getItemLayout = (data, index) => {
        
            const length = layoutWidth;
            const offset = layoutOffset;
            
            
            return {length, offset, index}
        }
        
        // Divide the horizontal offset by the width of the view to see which page is visible
        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        
        savePageNumber(id, pageNum);
        
    }
    
    let initialRender = pageNumber + 1;
    
    
    return (
        
        <View
            onLayout={(e) => {
            
            let contentOffset = e.nativeEvent.contentOffset;
            let viewSize = e.nativeEvent.layout;
            layoutWidth = viewSize.width;
            layoutOffset = viewSize.x;
            //globalXOffset = layoutOffset;
            // getItemLayout = (data, index) => {
        
            //     const length = layoutWidth;
            //     const offset = layoutOffset;
                
                
            //     return {length, offset, index}
            // }
            

            }} >
            <FlatList
    
                ref = {flatlist}
                data = {data}
                //getItemLayout = {getItemLayout}
                
                onLayout={e => {
                    globalXOffset = e.nativeEvent.layout.width;
                    //console.log(globalXOffset, "XXXXX");
                    //console.log("hehehe", e.nativeEvent.layout);
                   //getItemLayout=(data, index) => { return { length: e.nativeEvent.layout.width, index, offset: e.nativeEvent.layout.width * index } };
                }}
                getItemLayout={(data, index) => { 
                    //console.log(globalXOffset, "SSSS");
                    return { 
                        length: globalXOffset, index, offset: globalXOffset * index 
                    } 
                }}
                //keyExtractor={({ id }) => id}
                //keyExtractor={(index) => index}
                keyExtractor={(item, index) => index.toString()}
                horizontal = {true}
                pagingEnabled = {true}
                showsHorizontalScrollIndicator = {false}
                initialNumToRender = {initialRender}
                onMomentumScrollEnd={onScrollEnd}
                initialScrollIndex = {pageNumber}
                
                
                renderItem={({ item }) => {
                    
                    return (
                        <View>
                            
                            
                            <Item item={item} />
                            
                        
                        </View>
                    )
                }}
            />
        </View>
    )
}

const savePageNumber = async(id, pageNumber) => {
    
    AsyncStorage.setItem(id + "pageNumber", JSON.stringify(pageNumber));


}
const Item = (item) => {
    
    return (
        <View style={styles.page}>
            {item.item.pageNumber === "x" ? (
                
                <View style={styles.pageIntro}>
                    <ScrollView>

                        <Image 
                            style={styles.logo} source={require("../assets/transparentLogo2.png")}
                            resizeMode="contain" />
                        <Text style={styles.pageIntroTextTitle}>{item.item.pageContent[4]}</Text>
                        <Text style={styles.pageIntroTextAuthor}>{item.item.pageContent[0]}</Text>
                        <Text style={styles.pageIntroTextOrigin}>{item.item.pageContent[1]}</Text>
                        <Text style={styles.pageIntroTextYear}>{item.item.pageContent[2]}</Text>
                        <Text style={styles.pageIntroTextGenre}>{item.item.pageContent[3]}</Text>
                    </ScrollView>
                    
                </View>
            )
            :
            (
                <ScrollView
                snapToEnd = {false}
            >

                <Text style={styles.text}>{item.item.pageContent}</Text>
                <Text style={styles.pageNumber}>{item.item.pageNumber}</Text>

            </ScrollView>
            )}
            
        </View>
    )
}

const ReaderScreen = ({ route, navigation }) => {

    const { id } = route.params;
    const { title } = route.params;
    const { author } = route.params;
    const { year } = route.params;
    const { status } = route.params;
    let { contentArr } = route.params;
    const { pageNumber } = route.params;
    const { authorOrigin } = route.params;
    const { genre } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            
            
            {fetchContent(id, status, title, author, year, contentArr, pageNumber, authorOrigin, genre)}
            

        </SafeAreaView>
    );
}



export default ReaderScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        
    },

    flatlistView: {
        
    },

    text: {
        fontSize: 17,
        
    },
    page: {
        
        width: Dimensions.get('screen').width - 10,
        //height: Dimensions.get('screen').height - 10,
        
        padding: 5,
        marginBottom: 14,
        
        
    },
    pageNumber: {
        //alignSelf: "flex-end",
        alignSelf: "center",
        paddingBottom: 2
        
        
    },

    pageIntro: {
        
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch"
        
    },
    pageIntroTextTitle: {
        fontSize: 27,
        fontWeight: "bold",
        alignSelf: "center"

    },
    pageIntroTextAuthor: {
        fontSize: 27,
        alignSelf: "center"
        
    },
    pageIntroTextOrigin: {
        fontSize: 27,
        alignSelf: "center"
        
    },
    pageIntroTextYear: {
        fontSize: 27,
        fontStyle: "italic",
        alignSelf: "center"
        
    },

    pageIntroTextGenre: {
        fontSize: 27,
        alignSelf: "center"
        
        
    },
    logo: {
        width: 300,
        height: 300,
        alignSelf: "center"
    }
    

})