import * as React from 'react';
import {
	Text,
	View,
	StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView
	
} from 'react-native';

import {showOfferGroup,hideOfferGroup} from '../../actions';
import{openPhotoViewer} from '../../actions/PhotoViewer';

import { connect } from 'react-redux';
import OfferItem from './OfferItem'

export class OffersList extends React.Component {

constructor(props) {
	super(props); 
}

componentWillReceiveProps(props){
   
}

renderOffer=offers=>{
    return offers.offers.map(offer =>{
        var cartItem = this.props.cart[offer.id.toString()];

        if(cartItem){
            offer.inCart = cartItem.inCart
            offer.cartQty = cartItem.cartQty
            offer.toCartQty = cartItem.cartQty
        }else{
            offer.inCart = false
            offer.cartQty = null
            offer.toCartQty = 1
        }

        return <OfferItem key={offer.id} offer={offer} cartItem={cartItem} rest={offer.rest} cartQty={offer.cartQty} visible={offer.visible}></OfferItem>



    })
}

renderMoreOffers = (offerGroup,index) =>{
    if(offerGroup.hidden_offer_count>0&&offerGroup.collapsed==true){ 
        return (
            <TouchableOpacity
                onPress={ ()=>this.props.showOfferGroup(index)}
            >
            <View style={{ flexDirection:'row', justifyContent:'flex-end',  paddingHorizontal:16,  paddingBottom:8}}>
                <Text style={{fontSize:13, color:'#86adde'}}>еще {offerGroup.hidden_offer_count} предложений</Text>
            </View>
            </TouchableOpacity>
        )
    }else if(offerGroup.hidden_offer_count>0&&offerGroup.collapsed==false){ 
        return (
            <TouchableOpacity
                onPress={ ()=>this.props.hideOfferGroup(index)}
            >
            <View style={{ flexDirection:'row', justifyContent:'flex-end',  paddingHorizontal:16,  paddingBottom:8}}>
                <Text style={{fontSize:13, color:'#86adde'}}>скрыть {offerGroup.hidden_offer_count} предложений</Text>
            </View>
            </TouchableOpacity>
        )
    }
}

renderOfferGroup = (offerGroup, index) =>{

        return(
            <View key={offerGroup.oem} style={{  position:'relative', backgroundColor:'#fff'}}>
                <View style={{ flexDirection:'row', justifyContent:'flex-start',  paddingHorizontal:16,  backgroundColor:'#fafafa', paddingVertical:8}}>

                    <Image source={{uri:'http://etsgroup.ru/img_serv/brands/'+offerGroup.brand+'.png'}} style={{width:20, height:20, marginRight:8}}></Image>
                    <Text style={{color:'#666', fontWeight:'800'}}>{offerGroup.brand} {offerGroup.oem}</Text>
                    
                </View>
                { this.renderOffer(offerGroup)}
                
                { this.renderMoreOffers(offerGroup,index) }
                                
            </View>
        )
    
}


renderImage=(images, index)=>{
    const image = images[index]
	return(
        <TouchableOpacity
            key={image.src} 
            onPress={()=>{ this.props.openPhotoViewer(images, index) }}
        >
				<View  key={image.key} style={{position:'relative', borderRadius:3, marginLeft:3,width:80, height:80,}}>
					<Image source={{uri:image.src}} style={{width:80, height:80, borderRadius:3}} />
					<View style={{ position:'absolute', width:'100%', top:0, height:'100%', backgroundColor:'#4c4c4c3d', zIndex:10, paddingHorizontal:8, paddingVertical:3,  justifyContent:'flex-end' , borderRadius:3}}>
					</View>
				</View>
        </TouchableOpacity>
	)
}

renderImageSmall(images){
	if(images&&images.length>0){
        return <ScrollView horizontal showsHorizontalScrollIndicator={false}>{Object.values(images).map((image,index )=> this.renderImage(images, index) )}</ScrollView>
	}else{
		return null
	}
}

renderListHeader=()=>{
    return(

        <View style={{flexDirection:'row', paddingVertical:16, paddingHorizontal:8, backgroundColor:'#fff'}}>
            { this.renderImageSmall(this.props.images) }
        </View>

    )
}

render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                
                <FlatList
                    data={this.props.offers}
                    renderItem={({item, index}) =>  this.renderOfferGroup(item,index) }  
                    keyExtractor={(item, index) => index.toString()} 
                    initialNumToRender={6}
                    refreshing={false}
                    ListHeaderComponent={this.renderListHeader}
                    extraData={this.props.cart}
                    
                >
                
                </FlatList>
            </View>

        );

}
}


const styles = StyleSheet.create({
	scrollViewContent: {
		backgroundColor:'#fff'
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: '#03A9F4',
		overflow: 'hidden',
	  }
  });


  const mapStateToProps = state => {
    return {
        cart: state.cart.cart,
        images:state.offers.images,
        cartRefreshDate: state.cart.cartRefreshDate
    }
}
const mapDispatchToProps = (dispatch, payload) => {
    return{
        showOfferGroup : payload => dispatch(showOfferGroup(payload)),
        hideOfferGroup : payload => dispatch(hideOfferGroup(payload)),
        openPhotoViewer: (payload, index) => dispatch(openPhotoViewer(payload,index)),

    } 
}
export default connect(mapStateToProps, mapDispatchToProps)(OffersList)
