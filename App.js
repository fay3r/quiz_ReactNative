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
import SQLite from 'react-native-sqlite-storage';
import NetInfo from '@react-native-community/netinfo';

const _ = require('lodash');
let playerScore = 0;
const STORAGE_KEY = '@save_rule_status';
const BASEURL = 'http://tgryl.pl/quiz/';
let testIDs = [];
let allTestsData = [];
let allTestsDetails = [];

let DB;
const getDB = () => DB ? DB : DB = SQLite.openDatabase({name: 'testbase.db', createFromLocation: 1});

const querysToCreate = ['DROP TABLE IF EXISTS tests;',
    'DROP TABLE IF EXISTS tags;',
    'CREATE TABLE "tests" ( "id" TEXT, "name" TEXT, "description" TEXT, "tags" INTEGER, "level" TEXT, "numberOfTasks" INTEGER, PRIMARY KEY("id"));',
    'CREATE TABLE "tags" ( "tag" TEXT, "id_tag" INTEGER, PRIMARY KEY("tag") )',
    'DROP TABLE IF EXISTS questions;',
    'DROP TABLE IF EXISTS answers;',
    'CREATE TABLE "questions" ( "question" TEXT, "id" TEXT, "duration" INTEGER, PRIMARY KEY("question"));',
    'CREATE TABLE "answers" ( "content" TEXT, "question" TEXT, "isCorrect" TEXT, PRIMARY KEY("content","question"));',
];

let netStat;
const isOnline = NetInfo.addEventListener(state => {
    netStat = state.isConnected;
});

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testsList: [],
            aTag: [],
        };
    }

    async getTestContent(id) {
        return await fetch(BASEURL + 'test/' + id)
            .then((response) => response.json())
            .then((json) => {
                return json;
            })
            .catch((error) => console.error('error 4 ' + error));
    }

    async goToTest(navigation, item) {
        playerScore = 0;
        const testContent = await this.getTestContent(item.id);
        testContent.tasks = _.shuffle(testContent.tasks);
        navigation.navigate(item.id, {
            id: item.id,
            testContent: testContent,
            qnumber: 0,
            lastquestion: item.numberOfTasks,
        });

    }

    async getFromDb(database) {
        let query = 'SELECT * FROM tags;';
        let table = [];
        database.transaction(tx => {
            tx.executeSql(query, [], (tx, results) => {
                let len = results.rows.length;
                if (len > 0) {
                    for (let i = 0; i < results.rows.length; i++) {
                        table.push(results.rows.item(i));
                    }
                    this.setState({aTag: table});
                }
            });
        });

        let tags = this.state.aTag;
        query = 'SELECT * FROM tests;';
        let table2 = [];
        database.transaction(tx => {
            tx.executeSql(query, [], (tx, results) => {
                let len = results.rows.length;
                if (len > 0) {
                    for (let i = 0; i < results.rows.length; i++) {
                        table2.push(results.rows.item(i));
                        let idtag = table2[i].id;
                        table2[i].aTag = [];
                        aTag.forEach((item, z) => {
                            if (item.id_tag === idtag) {
                                table2[i].aTag.push(item.tag);
                            }
                        });
                    }
                    allTestsData = table;
                    this.setState({testsList: table});
                }
            });
        });
    }

    componentDidMount() {

        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                fetch(BASEURL + 'tests')
                    .then((response) => response.json())
                    .then((json) => {
                        this.setState({testsList: _.shuffle(json)});
                    })
                    .catch((error) => console.error('error 3 ' + error));
            } else {
                this.getFromDb(DB);

            }
        });

    }

    render() {

        const testsList = this.state.testsList;
        const navigation = this.props.navigation;
        let tests = 1;
        const renderItem = ({item}) => (

            <View style={styles.item}>
                <TouchableOpacity onPress={() => {
                    this.goToTest(navigation, item);
                }}>
                    <Text style={[styles.title, styles.langar]}>{item.name}</Text>
                    <View style={[{flexDirection: 'row'}]}>
                        {
                            item.tags.map((el) => (
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
                <Text style={[{alignSelf: 'center'}, styles.opensansb]}>{testContent.tasks[qnumber].question}</Text>
            </View>
            <View style={{flex: 9}}>
                <View style={styles.answersBox}>
                    <View style={styles.answersRow}>
                        {question.answers.map((el) => (
                                <View style={{marginTop: 15}}>
                                    <Button title={el.content} style={styles.answers}
                                            onPress={() => {
                                                if (el.isCorrect) {
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

    NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
            fetch(BASEURL + 'result', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        nick: 'PS',
                        score: playerScore,
                        total: numberOfQuestions,
                        type: testName,
                    },
                ),
            });
        } else {
            ToastAndroid.showWithGravity('No network!', ToastAndroid.SHORT, ToastAndroid.TOP);
        }
    });
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
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                fetch(BASEURL + 'results')
                    .then((response) => response.json())
                    .then((json) => setRankScore(json.reverse()))
                    .catch((error) => console.error(error));
            } else {
                ToastAndroid.showWithGravity('no network!', ToastAndroid.SHORT, ToastAndroid.TOP);
            }
        });
        return () => {
        };
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(100).then(() => {
            NetInfo.fetch().then(state => {
                if (state.isConnected == true) {

                    fetch(BASEURL + 'results')
                        .then((response) => response.json())
                        .then((json) => setRankScore(json.reverse()))
                        .catch((error) => console.error(error));
                    setRefreshing(false);
                    ToastAndroid.showWithGravity('Odswieżono!', ToastAndroid.SHORT, ToastAndroid.TOP);
                } else {
                    ToastAndroid.showWithGravity('No network!', ToastAndroid.SHORT, ToastAndroid.TOP);
                    setRefreshing(false);
                }
            });
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

class OwnDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation: props.navigation,
            net: false,
        };
    }

    componentDidMount() {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                this.setState({net: true});
            } else {
                this.setState({net: false});
            }
        });
    }

    async getTestOnline(id) {
        return fetch(BASEURL + 'test/' + id)
            .then((response) => response.json())
            .then((json) => {
                return json;
            })
            .catch((error) => console.error(error));
    };

    async goToTestOnline(navigation, item) {
        playerScore = 0;
        const testContent = await this.getTestOnline(item.id);
        testContent.tasks = _.shuffle(testContent.tasks);
        navigation.navigate(item.id, {
            id: item.id,
            testContent: testContent,
            qnumber: 0,
            lastquestion: item.numberOfTasks,
        });
    };

    async getTestOffline(id) {
        let i = 0;
        while (allTestsDetails[i] != null) {
            if (allTestsDetails[i].id == id) {
                return allTestsDetails[i];
            }
            i++;
        }
    };

    async goToTestOffline(navigation, item) {
        playerScore = 0;
        const testContent = await this.getTestOffline(item.id).catch();
        testContent.tasks = _.shuffle(testContent.tasks);
        navigation.navigate(item.id, {
            id: item.id,
            testContent: testContent,
            qnumber: 0,
            lastquestion: item.numberOfTasks,
        });
    };

    render() {
        const navigation = this.state.navigation;
        const netStatus = this.state.net;
        allTestsData = _.shuffle(allTestsData);
        return (
            <DrawerContentScrollView>
                <View style={[{alignItems: 'center'}]}>
                    <View style={[{flex: 1}]}>
                        <Image source={require('./png/score.png')}
                               style={{height: 100, width: 120, alignSelf: 'center', resizeMode: 'stretch'}}/>
                        <Text style={[{marginTop: 10, fontSize: 22}, styles.langar]}>Quizowanko</Text>
                    </View>
                    <TouchableOpacity style={[{marginTop: 10, backgroundColor: 'gray', padding: 5}]} onPress={() => {
                        navigation.navigate('Home');
                    }}><Text style={styles.opensansitalic}>Strona Glowna</Text></TouchableOpacity>
                    <TouchableOpacity style={[{marginTop: 10, backgroundColor: 'gray', padding: 5}]} onPress={() => {
                        navigation.navigate('Rank');
                    }}><Text style={styles.opensansitalic}>Ranking</Text></TouchableOpacity>

                        <TouchableOpacity style={[{marginTop: 10, backgroundColor: 'cyan', padding: 5}]} onPress={()=> {
                            NetInfo.fetch().then(state => {
                                if (state.isConnected == true) {
                                    this.goToTestOnline(navigation,allTestsData[Math.floor(Math.random() * allTestsData.length)])
                                } else {
                                    this.goToTestOffline(navigation,allTestsData[Math.floor(Math.random() * allTestsData.length)])
                                }
                            });
                        }}
                        ><Text>Losowy
                            test</Text></TouchableOpacity>

                    {
                        netStatus == true ?
                            allTestsData.map((el) => (
                                <TouchableOpacity style={[{marginTop: 5, backgroundColor: 'gray', padding: 5}]}
                                                  onPress={() => {
                                                      this.goToTestOnline(navigation, el);
                                                  }
                                                  }><Text
                                    style={[styles.opensansitalic, {textAlign: 'center'}]}>{el.name}</Text></TouchableOpacity>
                            ))
                            :
                            allTestsData.map((el) => (
                                <TouchableOpacity style={[{marginTop: 5, backgroundColor: 'gray', padding: 5}]}
                                                  onPress={() => {
                                                      this.goToTestOffline(navigation, el);
                                                  }
                                                  }><Text
                                    style={[styles.opensansitalic, {textAlign: 'center'}]}>{el.name}</Text></TouchableOpacity>
                            ))
                    }
                    <TouchableOpacity style={[{marginTop: 10, backgroundColor: 'cyan', padding: 5}]} onPress={()=>{

                        NetInfo.fetch().then(state => {
                            if (state.isConnected == true) {
                                fetch('http://tgryl.pl/quiz/tests')
                                    .then((response) => response.json())
                                    .then((json) => allTestsData  = _.shuffle(json))
                                    .catch((error) => console.error(error));
                                ToastAndroid.showWithGravity('updated!', ToastAndroid.SHORT, ToastAndroid.TOP)
                            } else {
                                ToastAndroid.showWithGravity('no network!', ToastAndroid.SHORT, ToastAndroid.TOP)
                            }
                        })
                    }
                    }><Text>Aktualizuj
                        baze</Text></TouchableOpacity>


                </View>
            </DrawerContentScrollView>

        );
    }

}

const Drawer = createDrawerNavigator();

class App extends Component {
    constructor(props) {
        super(props);
        getDB();
        this.state = {
            testsList: [],
            tags: [],
        };
    }

    async createTestsTable(database) {
        database.transaction(tx => {
            querysToCreate.forEach(value => {

                tx.executeSql(value, []);
            });
        });
    }

    async putTestToDB(database) {
        this.state.testsList.forEach((item, i) => {
            const q = 'INSERT INTO tests VALUES("' + item.id + '" , "' + item.name + '" , "' + item.description + '" ,' + 1 + ', "' + item.level + '" ,' + item.numberOfTasks + ');';
            let q2;
            database.transaction(tx => {
                tx.executeSql(q, [], (transaction, resultSet) => {
                });
                item.tags.forEach((item2, i) => {
                    q2 = 'INSERT INTO tags VALUES( "' + item.tags[i] + '" , "' + item.id + '" );';
                    tx.executeSql(q2, []);
                });
            });
        });
    }

    async putDetailsToDB(database) {
        let testsList = this.state.testsList;
        testsList.forEach((item, i) => {
            let singleTest;
            fetch('http://tgryl.pl/quiz/test/' + item.id)
                .then((response) => response.json())
                .then((json) => {
                    singleTest = json;
                })
                .then(() => {
                    database.transaction(tx => {
                        singleTest.tasks.forEach((item, i) => {
                            tx.executeSql('INSERT INTO questions VALUES( "' + item.question + '" , "' + singleTest.id + '" , ' + item.duration + ' )', [], (tx, results) => {
                            });
                            item.answers.forEach((item2, i2) => {
                                tx.executeSql('INSERT INTO answers VALUES( "' + item2.content + '" , "' + item.question + '" , "' + item2.isCorrect.toString() + '" )', [], (tx, results) => {
                                });
                            });
                        });
                    });
                })
                .catch((error) => console.log('error 1 ' + error));

        });
    }

    componentDidMount() {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                const asyncDate = AsyncStorage.getItem('DATE');
                const today = new Date().toJSON().slice(0,10).replace(/-/g,'/')
                if(asyncDate!== today) {
                    fetch(BASEURL + 'tests')
                        .then((response) => {
                            return response.json();
                        })
                        .then((json) => {
                            this.setState({testsList: _.shuffle(json)});
                            allTestsData = (json);
                        }).then(() => this.createTestsTable(DB))
                        .then(() => this.putTestToDB(DB))
                        .then(() => this.putDetailsToDB(DB))
                        .catch((error) => {
                            console.error('error 2 ' + error);
                        });
                    AsyncStorage.setItem('DATE',today);
                } else {
                    this.getFromDb(DB);
                }

            } else {
                this.getFromDb(DB);
            }
        });
        SplashScreen.hide();
    }

    async getFromDb(database) {
        let query = 'SELECT * FROM tags;';
        let table = [];
        database.transaction(tx => {
            tx.executeSql(query, [], (tx, results) => {
                let len = results.rows.length;
                if (len > 0) {
                    for (let i = 0; i < results.rows.length; i++) {
                        table.push(results.rows.item(i));
                    }
                    this.setState({tags: table});
                }
            });
        });

        let tags = this.state.tags;
        query = 'SELECT * FROM tests;';
        let table2 = [];
        database.transaction(tx => {
            tx.executeSql(query, [], (tx, results) => {
                let len = results.rows.length;
                if (len > 0) {
                    for (let i = 0; i < results.rows.length; i++) {
                        table2.push(results.rows.item(i));
                        let idtag = table2[i].id;
                        table2[i].tags = [];
                        tags.forEach((item, z) => {
                            if (item.id_tag === idtag) {
                                table2[i].tags.push(item.tag);
                            }
                        });
                    }
                    _.shuffle(table);
                    allTestsData = table;
                    this.getTestsDetails(database);
                    this.setState({testsList: table});
                }
            });
        });
    }

    async getTestsDetails(db){
        let tests = allTestsData;
        db.transaction(tx=>{
            let testsDetails = [];
            tests.forEach((itm, i) => {
                let tasks = [];
                tx.executeSql('SELECT * FROM questions WHERE id LIKE "' + itm.id + '" ;',[],(tx,resultsQuest)=>{
                    for(let j = 0; j < resultsQuest.rows.length; j++){
                        let answers = [];
                        tx.executeSql('SELECT * FROM answers WHERE question LIKE "' + resultsQuest.rows.item(j).question + '" ;',[],(tx,resultsAnswer)=>{
                            for(let k = 0; k < resultsAnswer.rows.length; k++){
                                if(resultsAnswer.rows.item(k).isCorrect == "true"){
                                    answers.push({
                                        "content": resultsAnswer.rows.item(k).content,
                                        "isCorrect": true
                                    });
                                }
                                else{
                                    answers.push({
                                        "content": resultsAnswer.rows.item(k).content,
                                        "isCorrect": false
                                    });
                                }
                            }
                            tasks.push({
                                "question": resultsQuest.rows.item(j).question,
                                "answers": answers,
                                "duration":parseInt(resultsQuest.rows.item(j).duration)
                            });
                            if(j == (resultsAnswer.rows.length-1)){
                                testsDetails.push({
                                    "tags": itm.tags,
                                    "tasks": tasks,
                                    "name": itm.name,
                                    "description": itm.description,
                                    "level": itm.level,
                                    "id":itm.id
                                });
                                if(i == (tests.length - 1)){
                                    allTestsDetails = testsDetails;
                                }
                            }
                        });
                    }
                });
            })
        })
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
                        testsList.map(el =>
                            (
                                <Drawer.Screen name={el.id} component={TestScreen}/>
                            ))
                    }
                </Drawer.Navigator>
            </NavigationContainer>
        );
    }
}

export default App;
