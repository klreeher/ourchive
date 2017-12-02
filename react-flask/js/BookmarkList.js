import React from 'react';
import axios from 'axios';
import Chapter from './Chapter';
import TagList from './TagList';
import Link from 'react-router-dom';
import SingleWork from './SingleWork';


export default class BookmarkList extends React.Component {

	getBookmarks(curatorId)
	{
	  axios.get('/api/bookmark/curator/'+curatorId)
	      .then(function (response) {
	        this.setState({
	          bookmarks: response.data[0],
	          current_page: response.data[1]

	        });

	        console.log(this.state.bookmarks);  

	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    });
	}

	constructor(props) {
	    super(props);
	    this.state = {curatorId: props.match.params.curatorId, bookmarks: [], current_page: 0};
    
    }

  componentWillMount() { 
    this.getBookmarks(this.state.curatorId); 
  }

  render() {
    return (
      <div>
        <div className="panel panel-default">
        	<div className="panel-body">
        		<div className="col-xs-8">
	          		<div className="row">
					    <div className="col-md-2">
					        <div>[CHAPTER ONE IMAGE HERE]
					            <br/>
					            <br/>
					            <br/>
					        </div>
					    </div>
					    <div className="col-md-8">
					        <div className="row">
					            <div className="col-md-12">
					                <div><h3>UNE TITLE BY SO-AND-SO</h3></div>
					            </div>
					        </div>
					        <div className="row">				        	
					            <div className="col-md-11 col-md-offset-1">
					                <div>SUMMARY SUMMARY SUMMARY</div>
					            </div>
					        </div>
					</div>
			        <div className="row">
			            <div className="col-md-12">
			                <div><h3>******</h3></div>
			            </div>
			        </div>
			        <div className="row">
			            <div className="col-md-12">
			                <div>
			                	[name] says...

			                </div>
			            </div>
			        </div>	
			        <br/>			        
			        <div className="row">
			            <div className="col-md-11 col-md-offset-1">
			                <div>
			                	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eget sapien in tortor mattis accumsan. Proin rutrum, libero non luctus euismod, augue mauris viverra felis, a ullamcorper ex lorem laoreet nisl. Suspendisse eleifend id tellus eget sodales. Proin magna ante, maximus ac felis nec, ultricies consectetur nisl. Curabitur sollicitudin odio id nulla tincidunt suscipit. Sed ornare vehicula enim eu bibendum. Sed sit amet condimentum lorem. Curabitur eu fermentum sapien. Integer vel volutpat nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec bibendum dignissim tincidunt. Morbi id quam mollis eros faucibus venenatis. Quisque malesuada nunc nec mi dapibus iaculis. Aenean eget scelerisque leo.

Sed tincidunt, nisi nec bibendum laoreet, ex tortor pretium enim, quis volutpat lacus purus a dui. Ut tellus massa, maximus varius mauris at, aliquet vestibulum risus. Praesent luctus imperdiet molestie. Nam suscipit ex non pulvinar suscipit. Phasellus sem augue, eleifend non pulvinar vel, tempus vitae purus. Curabitur vel posuere erat. Vivamus venenatis ante et facilisis vulputate. Quisque et tempus erat. Nullam luctus fermentum condimentum. Sed mollis pellentesque augue, id molestie augue suscipit eget. Nulla et aliquam risus. Aliquam ullamcorper ut ante sed pellentesque. Sed lacus massa, tristique non enim sit amet, commodo condimentum diam.

Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean tincidunt odio sed urna hendrerit, nec semper nibh congue. Fusce elit justo, semper ut porta ac, pretium a massa. Nulla faucibus, purus eu lobortis vehicula, sem tortor maximus velit, a luctus ante mauris et elit. Vivamus mattis elit quis tellus ultricies maximus. Suspendisse rutrum dolor eu velit rhoncus, a tempor tellus tristique. Suspendisse potenti. Ut venenatis convallis turpis, vitae pellentesque lectus sagittis luctus. Quisque a consectetur leo. Aenean dapibus, lectus non tempor ultrices, quam sem accumsan eros, eu accumsan urna ligula at mauris. Nullam vitae orci id nibh pellentesque pellentesque in et nisl. Suspendisse tristique eros at ullamcorper lobortis.

Suspendisse finibus rutrum odio et imperdiet. Curabitur at posuere elit. Pellentesque eleifend volutpat tellus ut hendrerit. In egestas, est ac dictum tempor, ligula dui sagittis ligula, in egestas nisl nisl eget sapien. Integer pulvinar eu orci eu scelerisque. Ut a malesuada nisl, non porta urna. Pellentesque libero magna, pharetra nec mi ut, mattis tincidunt est.

Praesent nec ex sit amet turpis luctus dictum porttitor vitae libero. Donec in mi massa. Aenean tempor iaculis massa ac vestibulum. Maecenas finibus mi sed ligula mollis, non bibendum mauris consequat. Pellentesque non lacinia velit. Donec id sollicitudin dolor. Sed sagittis tempus sollicitudin. Sed dui erat, facilisis sit amet mollis sit amet, congue id nunc. Donec nec nunc vel justo maximus pellentesque non a nisl. Maecenas imperdiet, ante dignissim condimentum consectetur, augue arcu eleifend felis, in molestie metus metus eget diam. In sit amet varius nisi, ut tempor ex.
			                </div>
			            </div>
			        </div>
					</div>	      			
		  			<br/>
		  			<div className="row">
			            <div className="col-md-12">
			                <div>
			                	If you like this, [name] recommends...
			                </div>
			            </div>
			            
			        </div>
			        <div className="row">
				        <div className="col-md-11 col-md-offset-1">
				                <div>
				                	LINK LINK LINK LINK LINK LINK
				                </div>
				            </div>
				        </div>
			        <div className="row">
			            <div className="col-md-12">
			                <div>
			                	TAG CATEGORY 1:
			                </div>
			            </div>			            
			        </div>
			        <div className="row">
			        	<div className="col-md-11 col-md-offset-1">
			                <div>
			                	TAG TAG TAG TAG REUSE TAGLIST HERE
			                </div>
			            </div>
			        </div>
		        </div>
		        <div className="col-xs-4">
		        	<div className="row">
		        		MY SIDEBAR BRINGS ALL THE BOYS TO THE YARD
		        	</div>
		        	<div className="row">
		        		and they're like, IT'S BETTER THAN YOURS
		        	</div>
		        	<div className="row">
		        		DAMN RIGHT
		        	</div>
		        	<div className="row">		        	
		        		<h3>IT'S BETTER THAN YOURS</h3>
		        	</div>
		        </div>
      		</div>
      	</div>
      </div>
    );
  }

}