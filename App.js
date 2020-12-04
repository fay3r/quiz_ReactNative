import * as React from 'react';
import { Image, SafeAreaView, View, Text, Button, FlatList, ScrollView, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerContentScrollView} from '@react-navigation/drawer';
import styles from './styles';
import {Table, Row, Rows} from 'react-native-table-component';

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
}, {
    id: '5',
    title: 'TEST5',
    tag1: '#new3',
    tag2: '#test3',
    info: 'asfnjksdng;skrfghnertig;mlsd bhhufnajkgbdnfsk;gvmbdfuniopbshnbmjsdkfl;bhfnuiao;vmls;bmskfbs',
}];

const TEST1 = {
    q1: [
        'Kto jest kim', 'odp pierwsza', 'odp druga', 'C', 'czwwarta', 'Correct',
    ],
    q2: [
        'question', 'A', 'B', 'C', 'D', 'Correct',
    ],
    q3: [
        'question', 'A', 'B', 'C', 'D', 'Correct',
    ],
    q4: [
        'question', 'A', 'B', 'C', 'D', 'Correct',
    ],
};

const TABLE_HEADS = ['nick','score','total','type','date'];
const DATA_TABLE = [['ktos','123','12313','fajny','12-41-56'],
    ['a','123','12313','fajny','12-41-56'],
    ['f','6','7745','jj','12-41-56'],
    ['g','5','12313','fhhajny','1111-41-56'],
    ['h','142','182313','fajny','12-41-56'],
    ['j','123','12313','gg','12-41-56'],
    ['h','15','568','ad','12-41-56']];


function HomeScreen({navigation}) {

    const renderItem = ({item}) => (

        <View style={styles.item}>
            <TouchableOpacity onPress={() => navigation.navigate(item.title, {name: item.title,question:1})}>
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
                <View style={{flex:1,marginLeft:10}} >
                    <TouchableOpacity onPress={()=> navigation.openDrawer()}>
                        <Image source={require('./png/more.png')}
                               style={{height: 30, width: 30, alignSelf: 'flex-start', resizeMode: 'stretch'}}/>
                    </TouchableOpacity>
                </View>
                <View style={[{flex:13,alignItems:'center'}]}>
                    <Text style={[{fontSize:22,fontWeight:'bold'}]}>Strona Glowna</Text>
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
    const {name,question} = route.params;
    console.log("qqqq"+question)
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{flex:1,marginLeft:10}} >
                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <Image source={require('./png/back.png')}
                               style={{height: 30, width: 30, alignSelf: 'flex-start', resizeMode: 'stretch'}}/></TouchableOpacity>
                </View>
                <View style={[{flex:13,alignItems:'center'}]}>
                    <Text style={[{fontSize:22,fontWeight:'bold'}]}>{name}</Text>
                </View>
            </View>
            <View style={styles.content}>
                {RenderQuestion(name,question)}
            </View>
        </SafeAreaView>
    );
}

function RenderQuestion(testName,qnumber) {
    console.log('q'+qnumber)
    let question = Reflect.get(TEST1, ('q'+qnumber));

    return (
        <View style={[{flex: 1}]}>
            <View style={[{
                flex: 1,
                marginTop: 5,
                flexDirection: 'row',
                alignItems:'center',
            }]}>
                <Text style={[{flex:1,marginStart:30}]}>Question {qnumber} of 15</Text>
                <Text style={[{flex:1,marginStart:60}]}>Time</Text>
            </View>
            <View style={[{flex: 1, justifyContent: 'center'}]}>
                <Text style={{alignSelf: 'center'}}>{question[0]}</Text>
            </View>
            <View style={{flex: 3}}>
                <View style={styles.answersBox}>
                    <View style={styles.answersRow}>
                        <Button title={question[1]} style={styles.answers} ></Button>
                        <Button title={question[3]} style={styles.answers} ></Button>
                    </View>
                    <View style={styles.answersRow}>
                        <Button title={question[2]} style={styles.answers} ></Button>
                        <Button title={question[4]} style={styles.answers} ></Button>
                    </View>
                </View>
            </View>
            <View style = {{flex:8}}></View>
        </View>
    );
}

function RankScreen({navigation}) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{flex:1,marginLeft:10}} >
                    <TouchableOpacity onPress={()=> {navigation.navigate('Home')}}>
                        <Image source={require('./png/back.png')}
                               style={{height: 30, width: 30, alignSelf: 'flex-start', resizeMode: 'stretch'}}/></TouchableOpacity>
                </View>
                <View style={[{flex:13,alignItems:'center'}]}>
                    <Text style={[{fontSize:22,fontWeight:'bold'}]}>Ranking</Text>
                </View>
            </View>
            <View style={styles.content}>
                <View style={[{ flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' }]}>
                    <ScrollView>
                        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                            <Row data={TABLE_HEADS} textStyle={styles.text}/>
                            <Rows data ={DATA_TABLE}textStyle={styles.text}/>
                        </Table>
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}

function OwnDrawer({navigation}) {
    return (
        <DrawerContentScrollView>
            <View style={{alignItems: 'center'}}>
                <Image source={require('./png/score.png')}
                       style={{height: 100, width: 120, alignSelf: 'center', resizeMode: 'stretch'}}/>
                <Text style={{marginTop: 10, fontSize: 22, fontWeight: 'bold'}}>Quizowanko</Text>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('Home');
                }}><Text>Strona Glowna</Text></TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('Rank');
                }}><Text>Ranking</Text></TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('TEST1', {name: 'TEST1',question:1});
                }}><Text>Test1</Text></TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('TEST2', {name: 'TEST2',question:1});
                }}><Text>Test2</Text></TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('TEST3', {name: 'TEST3',question:1});
                }}><Text>Test3</Text></TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                    navigation.navigate('TEST4', {name: 'TEST4',question:1});
                }}><Text>Test4</Text></TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function App() {
    return (
        <NavigationContainer>

            <Drawer.Navigator initialRouteName='Home' drawerContent={(props) => <OwnDrawer {...props} />}>
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
