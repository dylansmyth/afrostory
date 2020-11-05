import React, { useEffect, useState } from 'react';
import { Image, RefreshControl, SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, AsyncStorage, Platform } from 'react-native';









let isDone = false;
let connectivityReturnValue = true;
let clearKeys = [];


const fetchBooks = (whereFrom, navigation) => {
   
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        navigation.navigate("HomeStack");
        wait(2000).then(() => setRefreshing(false));
    }, []);

    
    
    try {

        useEffect(() => {
            getData(whereFrom)
            .then((res) => setData(res))
            
            .catch(function(error) {
                console.log(error);
                
            })
            .finally(() => setLoading(false));
        }, []);
    }
    catch(error) {
        console.log("caught this here");
    }
    if(!isLoading) {
        isDone = true;
    }

    

    return (
        <SafeAreaView>
            {!isDone ? <ActivityIndicator style={styles.activityIndicator}/> : (
                
    
                <FlatList
                    data={data}
                    keyExtractor={({ id }) => id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    
                    renderItem={({ item }) => {
                        let downloaded = "";
                        let backgroundColor = "black";
                        let status = "tag";
                        if(item.status == "stored") {
                            backgroundColor = "#22236a";
                            downloaded = "Downloaded";
                            item.status = "stored";
                            status = "stored";
                        }
                        else if(item.status == "fetched") {
                            backgroundColor = "#434447"
                            downloaded = "Not downloaded"
                            item.status = "fetched";
                            status = "fetched";
                        }
    

                        return (
                            <Item
                                item={item}
                                status={status}
                                style={{ backgroundColor }}
                                navigation={ navigation }
                                downloaded = {downloaded}
                                bookCount = {data.length -1}
                            />
                        )
                    }}
                />
    
            
                
            )}
        </SafeAreaView>
        
    )

}

const LibraryTag = () => {
    return (
        <View>
            <Text>Library</Text>
            <Text>6 books</Text>
        </View>
    )
}

const AppButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
);

const Item = ({ item, status, style, navigation, downloaded, bookCount}) => {
    let descriptionArr = [];
    let recommended = "";
    if(status == "stored") {
        downloaded = "Downloaded";
    }
    else if(status == "fetched") {
        downloaded = "Not downloaded";
    }
    else {
        downloaded = "";
    }
    if(item.editorsPick) {
        recommended = "Recommended";
    }

    let imageSource = "";
    if (item.genre == "Afro Classics") {
        imageSource= require("../assets/afroClassicsPic.png");
    }
    else if(item.genre == "Other Classics") {
        imageSource= require("../assets/otherClassicsPic.png");
    }
    else {
        imageSource= require("../assets/kidsPic.png");
    }
    
    const onPressClear = () => AsyncStorage.multiRemove(clearKeys);
    return (

        <View>
            {downloaded === "" ? (
                
                <View style={styles.libraryTag}>
                    <Text style={styles.libraryTagText}>{item.title}</Text>
                    <Text style={styles.titleProps}>{bookCount} books</Text>
                    
                    <AppButton title="Download All" onPress={() => navigation.navigate('Download', {
                        screen: 'Download',
                        params: {
                            individual: false,
                            pageNumber: 0,
                            id: item.id
                        }                       
                    })} />
                    {/* <AppButton title="Clear Async" onPress={onPressClear} /> */}
                    <AppButton title="Refresh" onPress={() => navigation.navigate("HomeStack")} />

                </View>
            )
            :
            (
                downloaded === "Downloaded" ? (
                    <TouchableOpacity
                    onPress={() => navigation.navigate('Description',
                    {
                        screen: 'Description',
                        params: {
                            id: item.id,
                            title: item.title,
                            author: item.author,
                            year: item.year,
                            status: item.status,
                            pageNumber: item.pageNumber,
                            descArr: descriptionArr,
                            authorOrigin: item.authorOrigin,
                            genre: item.genre    
                        }
                    } 
                    )}
                    style={[styles.item, style]}>

                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.authorProps}>by {item.author}</Text>

                        <Image source={imageSource} resizeMode="contain" style={styles.categoryTags}/>
                        {/* <Text style={styles.genreProps}>{item.genre}</Text> */}

                        <Text style={styles.recommendedProp}>{recommended}</Text>
                        <Text style={styles.downloadedProp}>{downloaded}</Text>
                    </TouchableOpacity> 

                )
                :
                (
                    <TouchableOpacity
                    onPress={() => navigation.navigate('Description',
                    {
                        screen: 'Description',
                        params: {
                            id: item.id,
                            title: item.title,
                            author: item.author,
                            year: item.year,
                            status: item.status,
                            pageNumber: 0,
                            descArr: descriptionArr,
                            authorOrigin: item.authorOrigin,
                            genre: item.genre      
                        }
                    } 
                    )}
                    style={[styles.item, style]}>

                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.authorProps}>by {item.author} </Text>
                        <Image source={imageSource} resizeMode="contain" style={styles.categoryTags}/>
                        {/* <Text style={styles.titleProps}>{item.genre} </Text> */}
                        <Text style={styles.recommendedProp}>{recommended}</Text>
                        <Text style={styles.downloadedProp}>{downloaded}</Text>
                    </TouchableOpacity> 
                )

            )
            }
        </View>
    

   )
};


const getData = async(whereFrom) => {
    let storedBooksArr = [];
    let fetchedBooksArr = [];
    let booksArr = [];
    if(whereFrom == "async") {
        
        try {
            let newKeys = [];
            const keys = await AsyncStorage.getAllKeys();
            clearKeys = keys;
            //every 13th value in the DB is id
            // for(let i=0;i < keys.length-4;i++) {
            //    console.log("key found", keys[i]) 
            //    if (i % 13 == 0) {
            //        newKeys.push(keys[i]);
            //        console.log("Key pushed", keys[i]) 
            //    }
            // }

            for(let i=0;i<keys.length;i++) {
                if( !keys[i].includes("authorName") &&
                    !keys[i].includes("authorOrigin") &&
                    !keys[i].includes("averageRating") &&
                    !keys[i].includes("category") && 
                    !keys[i].includes("content") &&
                    !keys[i].includes("description") &&
                    !keys[i].includes("downloadCount") &&
                    !keys[i].includes("editorsPick") &&
                    !keys[i].includes("pageNumber") &&
                    !keys[i].includes("ratingCount") &&
                    !keys[i].includes("title") &&
                    !keys[i].includes("year")) 
                    
                {
                    newKeys.push(keys[i]);
                    //console.log("Key pushed", keys[i]) 
                }
            }
            
            //console.log("new keys", newKeys, newKeys.length);
            //console.log("keys", keys, newKeys.length);
            for(let i=0;i<newKeys.length;i++) {
                let id = newKeys[i];
                let titleAsync = await AsyncStorage.getItem(id + "title");
                let authorAsync = await AsyncStorage.getItem(id + "authorName");
                let yearAsync = await AsyncStorage.getItem(id + "year");
                let pageNumberAsync = await AsyncStorage.getItem(id + "pageNumber");
                let authorOriginAsync = await AsyncStorage.getItem(id + "authorOrigin");
                let genreAsync = await AsyncStorage.getItem(id + "category");
                let editorsPickAsync = await AsyncStorage.getItem(id + "editorsPick");
                let title = JSON.parse(titleAsync);
                let author = JSON.parse(authorAsync);
                let year = JSON.parse(yearAsync);
                let pageNumber = JSON.parse(pageNumberAsync);
                let authorOrigin = JSON.parse(authorOriginAsync);
                let genre = JSON.parse(genreAsync);
                let editorsPick = JSON.parse(editorsPickAsync);
                
                storedBooksArr.push(
                    {
                        id: id,
                        title: title,
                        author: author,
                        year: year,
                        status: "stored",
                        pageNumber: pageNumber,
                        authorOrigin: authorOrigin,
                        genre: genre,
                        editorsPick: editorsPick
                    }
                )
            }
            
            
        }
        catch(error) {
            alert(error);
        }
        
    }
    if(whereFrom == "async") {
        
        
        
            if(connectivityReturnValue) {
                
                try {
                    const uri = "http://afrostoryapibooks-env.eba-dm7hpfam.us-east-2.elasticbeanstalk.com/books/titles";
                    await fetch(uri)
                    .then((response) => response.json())
                    .then((json) => {
                        for(let book of json) {
                            
                            fetchedBooksArr.push(
                                {
                                    id: book._id,
                                    title: book.Title,
                                    author: book.Auth_Name,
                                    year: book.Year,
                                    status: "fetched",
                                    editorsPick: book.EditorsPicks_bool,
                                    genre: book.Category
                                }
                            )
                        }
                    })         
                    .catch(function(error) {
                        console.log("You are offline1");
                        console.log(error);
                        
                    })
                    //.finally(() => setFetching(false));
                }
                catch(error) {
                    console.log("You are offline2");
                    console.log(error);
        
                }
                
                
            }
            else {
                console.log("You are offline3");
                setFetching(false);
            }

        
        
    }
    booksArr.push (
        {   
            id: "libraryTag",
            title: "Library",
            status: "tag"
        }
    )

    for(let storedBook of storedBooksArr) {
        booksArr.push(storedBook);
    }
    if(fetchedBooksArr.length > 0) {
        for(let fetchedBook of fetchedBooksArr) {
            
            let indicator = 0;
            let tempBook = fetchedBook;
            
            
            for(let storedBook of storedBooksArr) {

                if(fetchedBook.id == storedBook.id) {
                    indicator = 1;
                    break;
                }

            }
            
            if(indicator == 0) {
                booksArr.push(tempBook)
            }
        }
    }
    return booksArr;
}



const returnScreen = (navigation) => {
    
    return (
          
     <SafeAreaView style={styles.background}>
         
         {fetchBooks("async", navigation)}
     </SafeAreaView>
    );
}


// const checkConnectivity = async() => {
//     // For Android devices
//     if (Platform.OS === "android") {
//         NetInfo.fetch().then(isConnected => {
//         if (isConnected) {
//             //Alert.alert("You are online!");
//             connectivityReturnValue = true;
//             return true;
//         } else {
//             //Alert.alert("You are offline!");
//             connectivityReturnValue = false;
//             return false;
//         }
//         });
//     } 
//     // For iOS devices
//     else {       
//         NetInfo.addEventListener(
//         "connectionChange",
//         this.handleFirstConnectivityChange
//         );
//     }
    
// };

// const handleFirstConnectivityChange = isConnected => {
//     NetInfo.isConnected.removeEventListener(
//         "connectionChange",
//         this.handleFirstConnectivityChange
//     );

//     if (!isConnected) {
//         //Alert.alert("You are offline!");
//         connectivityReturnValue = false;
//         return true;
//     } else {
//         //Alert.alert("You are online!");
//         connectivityReturnValue = true;
//         return false;
//     }
// };


const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
}

const HomeScreen = ({ navigation }) => {
    
    return (
            
         
        <SafeAreaView style={styles.background}>
         
            {fetchBooks("async", navigation)}
        </SafeAreaView>
            
           
    );
}



const styles = StyleSheet.create({
    
    background: {
        flex: 1,   
        backgroundColor: "black"
    },
    scrollView: {
        
        backgroundColor: "dodgerblue"
    },
    scrollView1: {
        
        backgroundColor: "dodgerblue"
    },
    text: {
        fontWeight: "bold",
        fontSize: 20,
        padding: "2%"
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10
    },
    title: {
        fontSize: 32,
        color: "#FFFFFF"
    },
    titleProps: {
        color: "#C0C0C0"
    },
    authorProps: {
        color: "#C0C0C0",
        fontSize: 20
    },
    downloadedProp: {
        color: "#C0C0C0",
        alignSelf: "flex-end"

    },
    genreProps: {
        color: "#f3f70c"
    },
    recommendedProp: {
        color: "#f3f70c",
        alignSelf: "flex-end",
        fontWeight: "bold",
        textTransform: "uppercase"

    },
    libraryTag: {
        padding: 20
    },
    libraryTagText: {
        fontSize: 45,
        color: "#FFFFFF",
        
    },
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#ee5535",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 10,
        alignSelf: "flex-end"
   
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    categoryTags: {
        height: 50,
        width: 200,
        borderRadius: 10
    }


})

export default HomeScreen;