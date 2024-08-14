import React from "react";
import { View , Text} from "react-native";
import BottomNav from '../components/Bottomnav'; 


export default function Home(navigation) {
    return (
        <View>
         <Text>
            Profile
         </Text>
         <BottomNav navigation={navigation} />
        </View>    );
}