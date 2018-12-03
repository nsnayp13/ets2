import * as React from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Animated,
	Easing,
	StyleSheet
} from 'react-native';
import { Feather,MaterialIcons,FontAwesome } from '@expo/vector-icons';


import { connect } from 'react-redux';
import {addToCart,deleteFromCart, toggleModalVisible} from '../../actions';
import SrokText from './SrokText';
import {prettyNumber} from '../../helpers/helpers';

export class OfferItem extends React.Component {
	constructor(props) {
		super(props)
		this.props.offer = { ...this.props.offer}
		this.state = {}
		this.state.carMarginLeft = new Animated.Value(0)
	}



renderSrok=srok=>{
	return <SrokText srok={srok}></SrokText>
}

renderCart=offer=>{
	if(offer.inCart===false){
		return(
			<TouchableOpacity
			onPress={(e)=>{
				requestAnimationFrame(() => {
				Animated.timing(this.state.carMarginLeft, {
					toValue: 1 ,
					duration: 250,
		  
					easing:Easing.elastic()
				  }).start();
				})
			}}
			>
				<View style={styles.cartBtnFalse}>
					<Feather name="shopping-cart" size={20} color="#999" style={{}} />
				</View>
			</TouchableOpacity>
		)
	}else{
		return(
			<View style={{position:'relative'}}>
				<TouchableOpacity
					onPress={(e)=>{
						requestAnimationFrame(() => {
							Animated.timing(this.state.carMarginLeft, {
								toValue: 1 ,
								duration: 250,
					  
								easing:Easing.elastic()
							  }).start();
						})
					}}
				>
					<View style={styles.cartBtnTrue}>
						<Feather name="shopping-cart" size={20} color="#999" style={{}} />
					</View>
				</TouchableOpacity>

				<View style={styles.cartBtnNotify}>
					<Text style={{color:'#fff', fontSize:10, alignSelf:'center'}}>{this.props.offer.cartQty}</Text>
				</View>

			</View>
		)
	}
}

changeQty=(znak)=>{
	if(znak==1){
		return (this.props.offer.toCartQty<this.props.offer.qty)? this.props.offer.toCartQty+1:this.props.offer.toCartQty
	}else{
		return (this.props.offer.toCartQty>1)? this.props.offer.toCartQty-1:1
	}
}

render=()=>{
	console.log('render item', this.props.offer.cartQty)
	

	let carMarginLeft = this.state.carMarginLeft.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -410]
	});

	let bg =  this.state.carMarginLeft.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255, 255, 255,1)', 'rgba(245, 251, 255,1)']
    });

	const offer = this.props.offer;
	if(this.props.visible){
		return(
			<Animated.View key={offer.id} style={{width:'300%', flexDirection:'row', marginLeft:carMarginLeft,}}>
				<View  style={styles.row1}>
		
					<View style={styles.column1}>
						{this.renderSrok(offer.srok)}	
					</View>
					<View  style={styles.column2}>
						<Text style={{marginLeft:10, fontSize:14, color:'#999'}}>{offer.qty} шт</Text>
					</View>

					<View  style={styles.column3}>
					</View>

					<View  style={styles.column4}>
						<Text style={{marginLeft:10, fontSize:14, color:'#999'}}>{ prettyNumber(offer.price)} ₽</Text>
					</View>
					<View style={styles.column5}>
						<View  style={styles.infoIcon}>
							<TouchableOpacity
								onPress={(e)=>{ this.props.toggleModalVisible({modalVisible:true, modalData:offer}) }}
							>
								<View style={styles.cartBtnTrue}>
									<Feather name="info" size={22} color="#999" style={{}} />
								</View>
							</TouchableOpacity>
						</View>
						<View  style={styles.cartBtn}>
							{this.renderCart(offer)}
						</View>
					</View>
					
				</View>
				<Animated.View  style={[styles.row2,{backgroundColor:'#fff'}]}>
					<View style={{flexDirection:'row', alignContent:'flex-start', alignItems:'center'}}>

						<TouchableOpacity
							onPress={(e)=>{ this.props.offer.toCartQty = this.changeQty(0) }}
						>
							<View style={styles.iconMinusWrap}>
								<FontAwesome name="minus" size={14} color="#999" style={{}} />
							</View>
						</TouchableOpacity>

						<View style={styles.qtyText}>
							<Text>{this.props.offer.toCartQty} шт</Text>
						</View>
						<TouchableOpacity
						onPress={(e)=>{ this.props.offer.toCartQty = this.changeQty(1) }}
						>
							<View style={styles.iconPlusWrap}>
								<FontAwesome name="plus" size={14} color="#999" style={{}} />
							</View>
						</TouchableOpacity>
					</View>
					<View style={{flexDirection:'row', alignContent:'flex-end', justifyContent:'center', width:'20%'}}>
						<TouchableOpacity
							onPress={(e)=>{

								Animated.timing(this.state.carMarginLeft, {
									toValue: 0 ,
									duration: 250,
						
									easing:Easing.elastic()
								}).start();
								
								
								this.setState({cartQty:null, inCart:false},
									()=>{
										this.props.deleteFromCart(this.props.offer)
									})
								
							
								
							}}
						>
							<View style={styles.iconClose}>
								<MaterialIcons name="close" size={22} color="#f44336" style={{}} />
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={(e)=>{


								Animated.timing(this.state.carMarginLeft, {
									toValue: 0 ,
									duration: 250,
						
									easing:Easing.elastic()
								}).start();
								
								
								this.setState({cartQty:this.props.offer.toCartQty, inCart:true},()=>{
									this.props.addToCart(this.props.offer)
								})
								
							}}
						>
							<View style={styles.iconCheck}>
								<Feather name="check" size={22} color="#4CAF50" style={{}} />
							</View>
						</TouchableOpacity>
					</View>
					

				</Animated.View>
			</Animated.View>
		)
	}else{
		return null
	}
}
}

const styles = StyleSheet.create({
	row1:{width:'33.3333%', flexDirection:'row', justifyContent:'space-between', paddingLeft:16, paddingRight:8,  paddingVertical:4, borderTopColor:'#fafafa', borderTopWidth:1},
	row2:{width:'33.3333%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingLeft:16, paddingRight:8,   paddingVertical:0,  borderTopColor:'#fafafa', borderTopWidth:1},

	column1: {flexDirection:'row', alignItems:'center', justifyContent:'flex-start', width:'20%'},
	column2: {width:'20%', alignItems:'flex-end', alignContent:'center', justifyContent:'center'},
	column3: {width:'15%', alignItems:'center', justifyContent:'center', alignContent:'center', flexDirection:'row'},
	column4: {width:'20%',alignItems:'center',  justifyContent:'center', alignContent:'center'},
	column5:{width:'25%', flexDirection:'row', alignItems:'flex-end',justifyContent:'flex-end'},
	infoIcon:{ alignItems:'flex-end', justifyContent:'center'},
	cartBtn:{ alignItems:'flex-end',  justifyContent:'center'},
	cartBtnNotify:{position:'absolute', width:19, height:19, borderRadius:18, elevation:2, backgroundColor:'#f44336', padding:0, justifyContent:'center', left:23, top:-2},
	squireNal:{backgroundColor:'#4CAF50', width:16,borderRadius:2, height:16,borderColor:'#4CAF50'},
	squireDay:{backgroundColor:'#fff', width:16, height:16, borderRadius:2, borderWidth:2,borderColor:'#4CAF50'},
	squireWrap:{flexDirection:'row',alignItems:'center'},
	iconMinusWrap:{paddingVertical:8, paddingRight:10,paddingLeft:10,  marginRight:14, borderRadius:2, backgroundColor:'#eee'},
	iconPlusWrap:{paddingVertical:8, paddingRight:10,paddingLeft:10,  marginRight:14, borderRadius:2, backgroundColor:'#eee'},
	qtyText:{paddingVertical:8, paddingRight:10,paddingLeft:8,  marginRight:14, borderRadius:2, backgroundColor:'#fff'},
	cartBtnFalse:{paddingVertical:8, paddingRight:10,paddingLeft:8,borderRadius:2, backgroundColor:'#fff'},
	cartBtnTrue:{paddingVertical:8, paddingRight:10,paddingLeft:8, borderRadius:2, backgroundColor:'#fff'},
	iconClose:{paddingVertical:8, paddingRight:10,paddingLeft:8,  borderRadius:2, backgroundColor:'#fff'},
	iconCheck:{paddingVertical:8, paddingRight:10,paddingLeft:8,  borderRadius:2, backgroundColor:'#fff'},
	
  });



const mapStateToProps = state => {
    return {
    }
}
const mapDispatchToProps = (dispatch, payload) => {
    return{
		addToCart: (payload) => dispatch(addToCart(payload)),
		deleteFromCart: (payload) => dispatch(deleteFromCart(payload)),
		toggleModalVisible: (payload) => dispatch(toggleModalVisible(payload)),
		
		
    } 
}
export default connect(mapStateToProps, mapDispatchToProps)(OfferItem)