import React, {useState, useEffect} from 'react';
import {
    RefreshControl,
    Image,
    SafeAreaView,
    View,
    Text,
    Button,
    FlatList,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerContentScrollView} from '@react-navigation/drawer';
import styles from './styles';
import test1 from './text_files/test1';
import test2 from './text_files/test2';
import test3 from './text_files/test3';
import test4 from './text_files/test4';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountDown from 'react-native-countdown-component';


const DATA = [{
    id: '1',
    title: 'TEST1',
    tag1: '#new3',
    tag2: '#test3',
    info: 'asfnjksdng;skrfghnertig;mlsd bhhufnajkgbdnfsk;gvmbdfuniopbshnbmjsdkfl;bhfnuiao;vmls;bmskfbs',
}, {
    id: '2',
    title: 'TEST2',
    tag1: '#new3',
    tag2: '#test3',
    info: 'asfnjksdng;skrfghnertig;mlsd bhhufnajkgbdnfsk;gvmbdfuniopbshnbmjsdkfl;bhfnuiao;vmls;bmskfbs',
}, {
    id: '3',
    title: 'TEST3',
    tag1: '#new3',
    tag2: '#test3',
    info: 'asfnjksdng;skrfghnertig;mlsd bhhufnajkgbdnfsk;gvmbdfuniopbshnbmjsdkfl;bhfnuiao;vmls;bmskfbs',
}, {
    id: '4',
    title: 'TEST4',
    tag1: '#new3',
    tag2: '#test3',
    info: 'asfnjksdng;skrfghnertig;mlsd bhhufnajkgbdnfsk;gvmbdfuniopbshnbmjsdkfl;bhfnuiao;vmls;bmskfbs',
}];

const testHolder = {
    'TEST1': test1,
    'TEST2': test2,
    'TEST3': test3,
    'TEST4': test4,
};

const scoreBoard = [];
let playerScore = 0;
const STORAGE_KEY = '@save_rule_status';


function HomeScreen({navigation}) {

    const renderItem = ({item}) => (

        <View style={styles.item}>
            <TouchableOpacity onPress={() => navigation.navigate(item.title, {
                name: item.title,
                test: testHolder[item.title.toString()],
                qnumber: 0,
            })}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={[{flexDirection: 'row'}]}>
                    <Text style={styles.tags}>{item.tag1}</Text>
                    <Text style={styles.tags}>{item.tag2}</Text>
                </View>
                <Text style={{fontSize: 12}}>{item.info}</Text>
            </TouchableOpacity>
        </View>
    );

    return (

        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{flex: 1, marginLeft: 10}}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Image source={require('./png/more.png')}
                               style={{height: 30, width: 30, alignSelf: 'flex-start', resizeMode: 'stretch'}}/>
                    </TouchableOpacity>
                </View>
                <View style={[{flex: 13, alignItems: 'center'}]}>
                    <Text style={[{fontSize: 22, fontWeight: 'bold'}]}>Strona Glowna</Text>
                </View>
            </View>
            <View style={styles.content}>
                <FlatList
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListFooterComponent={
                        <View style={[{flexDirection: 'column', allignItems: 'flex-end', height: 100}]}>
                            <Text style={styles.footerText}>{'Poznaj swoja pozycje w rankingu'}</Text>
                            <View style={[{flexDirection: 'column', alignSelf: 'center', height: 30, width: 100}]}>
                                <Button title={'Ranking'} style={[{width: 20}]}
                                        onPress={() => navigation.navigate('Rank')}/>
                            </View>
                        </View>
                    } ListFooterComponentStyle={styles.container2}/>
            </View>
        </SafeAreaView>
    )
        ;
}

function TestScreen({route, navigation}) {
    const {name, test, qnumber} = route.params;
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{flex: 1, marginLeft: 10}}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Image source={require('./png/back.png')}
                               style={{
                                   height: 30,
                                   width: 30,
                                   alignSelf: 'flex-start',
                                   resizeMode: 'stretch',
                               }}/></TouchableOpacity>
                </View>
                <View style={[{flex: 13, alignItems: 'center'}]}>
                    <Text style={[{fontSize: 22, fontWeight: 'bold'}]}>{name}</Text>
                </View>
            </View>
            <View style={styles.content}>
                {test.length > qnumber ? RenderQuestion(navigation, test, qnumber, name) : RenderFinalScore(navigation, name)}

            </View>
        </SafeAreaView>
    );
}

function RenderQuestion(navigation, test, qnumber, testname) {
    const [key,setKey] = useState(0);
    console.log('render pytanie' + test[qnumber].duration);
    let time = test[qnumber].duration;
    return (
        <View style={[{flex: 1}]}>
            <View style={[{
                flex: 1,
                marginTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
            }]}>
                <Text style={[{flex: 1, marginStart: 30}]}>Question {qnumber + 1} of {test.length}</Text>
                <View style={[{paddingTop:20,paddingRight:10}]}>
                    <CountDown
                        key={key}
                        until={time}
                        size={15}
                        onFinish={() =>{ if(alert('asdas')){ console.log('asfasdgsdfhdfh')}}}
                        digitStyle={{backgroundColor: '#757575'}}
                        digitTxtStyle={[{color: '#00b3ff',fontSize:15}]}
                        timeToShow={[ 'S']}
                        timeLabels={{ s: 'S'}}

                    />
                </View>
            </View>
            <View style={[{flex: 1, justifyContent: 'center', marginStart: 40, marginEnd: 70}]}>
                <Text style={{alignSelf: 'center'}}>{test[qnumber].question}</Text>
            </View>
            <View style={{flex: 3}}>
                <View style={styles.answersBox}>
                    <View style={styles.answersRow}>
                        <View>
                            <Button title={test[qnumber].answers[0].content} style={styles.answers}
                                    onPress={() => {
                                        if (test[qnumber].answers[0].isCorrect) {
                                            console.log('poprawna');
                                            playerScore++;
                                        }
                                        console.log(playerScore);
                                        NextQuestion(navigation, testname, qnumber);
                                        setKey(prevKey => prevKey + 1)
                                    }}></Button>
                        </View>
                        <View style={[{marginTop: 7}]}>
                            <Button title={test[qnumber].answers[2].content}
                                    style={[styles.answers, {padding: 12314125}]}
                                    onPress={() => {
                                        if (test[qnumber].answers[2].isCorrect) {
                                            playerScore++;
                                        }
                                        NextQuestion(navigation, testname, qnumber);
                                        setKey(prevKey => prevKey + 1)
                                    }}></Button>
                        </View>
                    </View>
                    <View style={styles.answersRow}>
                        <View>
                            <Button title={test[qnumber].answers[1].content} style={styles.answers}
                                    onPress={() => {
                                        if (test[qnumber].answers[1].isCorrect) {
                                            playerScore++;
                                        }
                                        NextQuestion(navigation, testname, qnumber);
                                        setKey(prevKey => prevKey + 1)
                                    }}></Button>
                        </View>
                        <View style={[{marginTop: 7}]}>
                            <Button title={test[qnumber].answers[3].content} style={styles.answers}
                                    onPress={() => {
                                        if (test[qnumber].answers[3].isCorrect) {
                                            playerScore++;
                                        }
                                        NextQuestion(navigation, testname, qnumber);
                                        setKey(prevKey => prevKey + 1)
                                    }}></Button>
                        </View></View>
                </View>
            </View>
            <View style={{flex: 8}}></View>
        </View>
    );
}



function NextQuestion(navigation, testName, questionNumber) {
    if (questionNumber - 1 < test1.length) {
        navigation.navigate(testName, {
            name: testName,
            question: test1[questionNumber + 1],
            qnumber: questionNumber + 1,
        });
    }
}

function RenderFinalScore(navigation, testName) {
    scoreBoard.push({
        'nick': 'nicko',
        'date': new Date().toISOString().slice(0, 10),
        'score': playerScore,
        'total': test1.length,
        'type': testName,
    });
    playerScore = 0;
    return (
        <View style={[{flex: 1, alignItems: 'center'}]}>
            <Text style={[{marginTop: 4}]}>{'Nazwa: ' + testName}</Text>
            <Text style={[{marginTop: 4}]}>{'Uzyskany wynik: ' + scoreBoard[scoreBoard.length - 1].score}</Text>
            <Text style={[{marginTop: 4}]}>{'Możliwa liczba punktow: ' + test1.length}</Text>
            <Text style={[{marginTop: 4}]}>{'Data: ' + new Date().toISOString().slice(0, 10)}</Text>
            <View style={[{marginTop: 10}]}>
                <Button title={'ranking'} onPress={() => navigation.navigate('Rank')}></Button>
            </View>

        </View>
    );
}

function RankScreen({navigation}) {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(100).then(() => setRefreshing(false));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{flex: 1, marginLeft: 10}}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Home');
                    }}>
                        <Image source={require('./png/back.png')}
                               style={{
                                   height: 30,
                                   width: 30,
                                   alignSelf: 'flex-start',
                                   resizeMode: 'stretch',
                               }}/></TouchableOpacity>
                </View>
                <View style={[{flex: 13, alignItems: 'center'}]}>
                    <Text style={[{fontSize: 22, fontWeight: 'bold'}]}>Ranking</Text>
                </View>
            </View>
            <View style={[styles.content, {margin: 20}]}>
                <ScrollView style={{border: 'groove'}} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                    <View style={[{flexDirection: 'row', justifyContent: 'center'}]}>
                        <TouchableOpacity style={[styles.centerMode, styles.border, {
                            height: 40,
                            width: 80,
                            backgroundColor: '#999999',
                        }]}><Text style={styles.font22}>Nick</Text></TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.centerMode, styles.border, {width: 70, backgroundColor: '#999999'}]}><Text
                            style={styles.font22}>Wynik</Text></TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.centerMode, styles.border, {width: 70, backgroundColor: '#999999'}]}><Text
                            style={styles.font22}>Rodzaj</Text></TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.centerMode, styles.border, {width: 100, backgroundColor: '#999999'}]}><Text
                            style={styles.font22}>Data</Text></TouchableOpacity>
                    </View>
                    {createScoreBoard(scoreBoard)}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

function createScoreBoard(data) {
    const renderItem = ({item}) => (
        <View style={[{flex: 1}]}>
            <View style={{flexDirection: 'row'}}>
                <Text style={[styles.border, {width: 80}]}>{item.nick}</Text>
                <Text style={[styles.border, {width: 70}]}>{item.score + '/' + item.total}</Text>
                <Text style={[styles.border, {width: 70}]}>{item.type}</Text>
                <Text style={[styles.border, {width: 100}]}>{item.date}</Text>
            </View>
        </View>
    );
    return (
        <SafeAreaView>
            <FlatList
                data={scoreBoard}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
}


function RulesScreen({navigation}) {
    const [accepted, setAccepted] = useState(false);
    useEffect(() => {
        getData();
    }, []);

    if (accepted == true) {
        ToastAndroid.showWithGravity('Witamy ponownie!', ToastAndroid.SHORT, ToastAndroid.TOP);
        eval(navigation.navigate('Home'));
    }

    const onAccept = async () => {
        try {
            console.log(accepted);
            setAccepted(true);
            await AsyncStorage.setItem(STORAGE_KEY, 'true');
        } catch (err) {
            console.log(err);
        }
    };

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem(STORAGE_KEY);
            if (value !== null) {
                if (value == 'true') {
                    setAccepted(true);
                } else {
                    setAccepted(false);
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View style={[{alignItems: 'center', margin: 30}]}>
            <Text style={[{fontSize: 22, fontWeight: 'bold'}]}>Regulamin</Text>
            <Text style={[{fontSize: 12, marginTop: 20}]}>Zasada 1:</Text>
            <Text style={[{fontSize: 12}]}>Zasada 2:</Text>
            <Text style={[{fontSize: 12}]}>Zasada 3:</Text>
            <Text style={[{fontSize: 12}]}>Zasada 4:</Text>
            <Text style={[{fontSize: 12}]}>Zasada 5:</Text>
            <Text style={[{fontSize: 12}]}>Zasada 6:</Text>
            <Text style={[{fontSize: 12, marginBottom: 20}]}>Zasada 7:</Text>
            <Button title={'Akceptuj'} onPress={() => {
                onAccept();
                navigation.navigate('Home');
            }}></Button>
        </View>
    );

}

function OwnDrawer({navigation}) {
    useEffect(() =>{
        SplashScreen.hide();
    },[]);
    return (
        <DrawerContentScrollView>
            <View style={[{alignItems: 'center'}]}>
                <View style={[{flex: 1}]}>
                    <Image source={require('./png/score.png')}
                           style={{height: 100, width: 120, alignSelf: 'center', resizeMode: 'stretch'}}/>
                    <Text style={{marginTop: 10, fontSize: 22, fontWeight: 'bold'}}>Quizowanko</Text>
                </View>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('Home');
                }}><Text>Strona Glowna</Text></TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('Rank');
                }}><Text>Ranking</Text></TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('TEST1', {name: 'TEST1', question: test1[0], qnumber: 0});
                }}><Text>Test1</Text></TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('TEST2', {name: 'TEST2', question: test1[0], qnumber: 0});
                }}><Text>Test2</Text></TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('TEST3', {name: 'TEST3', question: test1[0], qnumber: 0});
                }}><Text>Test3</Text></TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('TEST4', {name: 'TEST4', question: test1[0], qnumber: 0});
                }}><Text>Test4</Text></TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}

const Drawer = createDrawerNavigator();

function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName='Rules' drawerContent={(props) => <OwnDrawer {...props} />}>
                <Drawer.Screen name='Rules' component={RulesScreen} options={{title: 'Regulamin'}}/>
                <Drawer.Screen name='Home' component={HomeScreen} options={{title: 'Strona glowna'}}/>
                <Drawer.Screen name='TEST1' component={TestScreen} options={{title: 'Test 1'}}/>
                <Drawer.Screen name='TEST2' component={TestScreen} options={{title: 'Test 2'}}/>
                <Drawer.Screen name='TEST3' component={TestScreen} options={{title: 'Test 3'}}/>
                <Drawer.Screen name='TEST4' component={TestScreen} options={{title: 'Test 4'}}/>
                <Drawer.Screen name='Rank' component={RankScreen} options={{title: 'Ranking'}}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default App;
