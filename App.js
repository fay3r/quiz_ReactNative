import React, {useState, useEffect, Component} from 'react';
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
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountDown from 'react-native-countdown-component';

let playerScore = 0;
const STORAGE_KEY = '@save_rule_status';
const BASEURL = 'http://tgryl.pl/quiz/';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testsList: [],
        };
    }

    componentDidMount() {
        fetch(BASEURL + 'tests')
            .then((response) => response.json())
            .then((json) => {
                this.setState({testsList: json});
            })
            .catch((error) => console.error(error));
    }

    async getTestContent(id) {
        return await fetch(BASEURL + 'test/' + id)
            .then((response) => response.json())
            .then((json) => {
                return json;
            })
            .catch((error) => console.error(error));
    }

    async goToTest(navigation, item) {
        playerScore = 0;
        const testContent = await this.getTestContent(item.id);
        navigation.navigate(item.id, {
            id: item.id,
            testContent: testContent,
            qnumber: 0,
            lastquestion: item.numberOfTasks,
        });

    }

    render() {
        const testsList = this.state.testsList;
        const navigation = this.props.navigation;
        console.log(navigation);
        let tests = 1;
        const renderItem = ({item}) => (
            <View style={styles.item}>
                <TouchableOpacity onPress={() => {
                    this.goToTest(navigation, item);
                }}>
                    <Text style={[styles.title,styles.langar]}>{item.name}</Text>
                    <View style={[{flexDirection: 'row'}]}>
                        {item.tags.map((el) => (
                            <Text style={styles.tags}>{el}</Text>
                        ))}
                    </View>
                    <Text style={[{fontSize: 12}]}>{item.description}</Text>
                </TouchableOpacity>
            </View>
        );
        return (

            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={{flex: 1, marginLeft: 10}}>
                        <TouchableOpacity onPress={() => {
                            navigation.openDrawer();
                        }}>
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
                        data={testsList}
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
}

function TestScreen({navigation, route}) {
    const {id, testContent, qnumber, lastquestion} = route.params;
    //const [testContent, setTestContent] = useState([]);

    // useEffect(async () => {
    //     fetch(BASEURL + 'test/' + id)
    //         .then((response) => response.json())
    //         .then((json) => setTestContent(json))
    //         .catch((error) => console.error(error));
    //
    // }, []);

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
                    <Text style={[{fontSize: 20, fontWeight: 'bold'}]}>{testContent.name}</Text>
                </View>
            </View>
            <View style={styles.content}>
                {lastquestion > qnumber ? RenderQuestion(navigation, testContent, qnumber) : RenderFinalScore(navigation, testContent.name, testContent.tasks.length)}

            </View>
        </SafeAreaView>
    );
}

function RenderQuestion(navigation, testContent, qnumber) {
    const [key, setKey] = useState(0);
    const [running, setRunning] = useState(true);

    useEffect(() => {
        setRunning(true);
        return () => {
            setRunning(false);
        };
    }, []);
    let question = testContent.tasks[qnumber];
    let time = testContent.tasks[qnumber].duration;
    return (
        <View style={[{flex: 1}]}>
            <View style={[{
                flex: 1,
                marginTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
            }]}>
                <Text style={[{flex: 1, marginStart: 30}]}>Question {qnumber + 1} of {testContent.tasks.length}</Text>
                <View style={[{paddingTop: 20, paddingRight: 10}]}>
                    <CountDown
                        key={key}
                        until={time}
                        size={15}
                        onFinish={() => {
                            setKey(prevKey => prevKey + 1);
                            NextQuestion(navigation, testContent, qnumber);
                        }}
                        digitStyle={{backgroundColor: '#757575'}}
                        digitTxtStyle={[{color: '#00b3ff', fontSize: 15}]}
                        timeToShow={['S']}
                        timeLabels={{s: 'S'}}
                        running={running}

                    />
                </View>
            </View>
            <View style={[{flex: 4, justifyContent: 'center', marginStart: 40, marginEnd: 70}]}>
                <Text style={[{alignSelf: 'center'},styles.opensansb]}>{testContent.tasks[qnumber].question}</Text>
            </View>
            <View style={{flex: 9}}>
                <View style={styles.answersBox}>
                    <View style={styles.answersRow}>
                        {question.answers.map((el) => (
                                <View style={{marginTop: 15}}>
                                    <Button title={el.content} style={styles.answers}
                                            onPress={() => {
                                                if (el.isCorrect) {
                                                    console.log('poprawna');
                                                    playerScore++;
                                                }
                                                NextQuestion(navigation, testContent, qnumber);
                                                setKey(prevKey => prevKey + 1);

                                            }}></Button>
                                </View>
                            ),
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}


function NextQuestion(navigation, testContent, questionNumber) {
    if (questionNumber - 1 < testContent.tasks.length) {
        navigation.navigate(testContent.id, {
            id: testContent.id,
            qnumber: questionNumber + 1,
            lastquestion: testContent.tasks.length,
        });
    }
}

function RenderFinalScore(navigation, testName, numberOfQuestions) {

    fetch(BASEURL+ 'result',{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                nick: "PS",
                score: playerScore,
                total: numberOfQuestions,
                type: testName,
            }
        )
    })
    return (
        <View style={[{flex: 1, alignItems: 'center'}]}>
            <Text style={[{marginTop: 4}]}>{'Nazwa: ' + testName}</Text>
            <Text style={[{marginTop: 4}]}>{'Uzyskany wynik: ' + playerScore}</Text>
            <Text style={[{marginTop: 4}]}>{'Możliwa liczba punktow: ' + numberOfQuestions}</Text>
            <Text style={[{marginTop: 4}]}>{'Data: ' + new Date().toISOString().slice(0, 10)}</Text>
            <View style={[{marginTop: 10}]}>
                <Button title={'ranking'} onPress={() => navigation.navigate('Rank')}></Button>
            </View>

        </View>
    );
}

function RankScreen({navigation}) {
    const [refreshing, setRefreshing] = useState(false);
    const [rankScore, setRankScore] = useState([]);

    useEffect(() => {
        fetch(BASEURL + 'results')
            .then((response) => response.json())
            .then((json) => setRankScore(json.reverse()))
            .catch((error) => console.error(error));

        return () => {
        };
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(100).then(() => {
            fetch(BASEURL + 'results')
                .then((response) => response.json())
                .then((json) => setRankScore(json.reverse()))
                .catch((error) => console.error(error));
            setRefreshing(false);
            ToastAndroid.showWithGravity('Odswieżono!', ToastAndroid.SHORT, ToastAndroid.TOP);
        });
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
                    {createScoreBoard(rankScore)}
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
                <Text style={[styles.border, {width: 100}]}>{item.createdOn}</Text>
            </View>
        </View>
    );
    return (
        <SafeAreaView>
            <FlatList
                data={data}
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
        ToastAndroid.showWithGravity('Witamy!', ToastAndroid.SHORT, ToastAndroid.TOP);
        navigation.navigate('Home');
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

    const [testsList, setTestsList] = React.useState([]);
    useEffect(() => {
        fetch(BASEURL + 'tests')
            .then((response) => response.json())
            .then((json) => setTestsList(json))
            .catch((error) => console.error(error));
        return () => {
        };
    }, []);

    const getTestContent= async(id) =>{

        return await fetch(BASEURL + 'test/' + id)
            .then((response) => response.json())
            .then((json) => {
                return json;
            })
            .catch((error) => console.error(error));
    }

    const goToTest=async(navigation, item) => {
        playerScore = 0;
        const testContent = await getTestContent(item.id);
        navigation.navigate(item.id, {
            id: item.id,
            testContent: testContent,
            qnumber: 0,
            lastquestion: item.numberOfTasks,
        });

    }

    return (
        <DrawerContentScrollView>
            <View style={[{alignItems: 'center'}]}>
                <View style={[{flex: 1}]}>
                    <Image source={require('./png/score.png')}
                           style={{height: 100, width: 120, alignSelf: 'center', resizeMode: 'stretch'}}/>
                    <Text style={[{marginTop: 10, fontSize: 22},styles.langar]}>Quizowanko</Text>
                </View>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('Home');
                }}><Text style={styles.opensansitalic}>Strona Glowna</Text></TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('Rank');
                }}><Text style={styles.opensansitalic}>Ranking</Text></TouchableOpacity>
                {
                    testsList.map((el) => (

                        <TouchableOpacity style={[{marginTop: 10}]} onPress={() => {
                            goToTest(navigation, el)
                        }
                        }><Text style={styles.opensansitalic}>{el.name}</Text></TouchableOpacity>
                    ))
                }
            </View>
        </DrawerContentScrollView>
    );
}

const Drawer = createDrawerNavigator();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testsList: [],
        };
    }

    componentDidMount() {
        fetch(BASEURL + 'tests')
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                console.log('json' + json);
                this.setState({testsList: json});
            })
            .catch((error) => {
                console.log(error);
            });
        SplashScreen.hide();
    }

    render() {
        const testsList = this.state.testsList;
        return (
            <NavigationContainer>
                <Drawer.Navigator initialRouteName='Rules' drawerContent={(props) => <OwnDrawer {...props} />}>
                    <Drawer.Screen name='Rules' component={RulesScreen}/>
                    <Drawer.Screen name='Home' component={HomeScreen}/>
                    <Drawer.Screen name='Rank' component={RankScreen}/>
                    {
                        testsList.map(el => (
                            <Drawer.Screen name={el.id} component={TestScreen}/>
                        ))
                    }
                </Drawer.Navigator>
            </NavigationContainer>
        );
    }
}

export default App;
