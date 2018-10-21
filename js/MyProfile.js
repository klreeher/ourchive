import React from 'react';
import axios from 'axios';
import Link from 'react-router-dom';
import {Tabs, Tab} from 'react-bootstrap';
import WorkStub from './WorkStub';
import UserContainer from './UserContainer';
import EditDeleteButtons from './EditDeleteButtons';
import { withRouter } from "react-router-dom";
import { withAlert } from 'react-alert'


class MyProfile extends React.Component {
	constructor(props) {
	  	super(props);
			if (this.props.csrf === undefined)
			{
        if (this.props.location.state != undefined) {
          this.props.csrf = this.props.location.state.csrf
        }
			}
	    this.state = this.state = {user: {}, works: [], bookmarks: [], curator: [], work_page: 1, bookmark_page: 1,
      work_pages: 1, bookmark_pages: 1};
        this.getUser = this.getUser.bind(this);
        this.getWorks = this.getWorks.bind(this);
        this.getBookmarks = this.getBookmarks.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.getWorkPage = this.getWorkPage.bind(this);
        this.getBookmarkPage = this.getBookmarkPage.bind(this);
        this.editMyAccount = this.editMyAccount.bind(this);
        this.deleteMyAccount = this.deleteMyAccount.bind(this);
    }

    fetchUser()
  	{
	  	axios.get('/api/user', {
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json',
          'CSRF-Token': this.props.csrf
          }})
	      .then(function (response) {
          this.getWorks(0, response.data['id']);
          this.getBookmarks(0, response.data['id']);
	        this.setState({
	          user: response.data
	        });

	      }.bind(this))
	      .catch(function (error) {
	        console.log(error);
	    });
  	}

    getUser()
    {

    	var userProfile = localStorage.getItem('jwt');
    	if (userProfile == undefined || localStorage.getItem('friendly_name') == undefined || userProfile = "")
    	{
    		  document.location.href="/";
    		  return;
    	}
    	else
    	{
        this.fetchUser();
    	}
    }

    previousPage(name) {
    switch (name) {
      case "work":
        this.getWorkPage(this.state.work_page - 1)
        break
      case "bookmark":
        this.getBookmarkPage(this.state.bookmark_page - 1)
        break
    }
  }

  nextPage(name) {
    switch (name) {
      case "work":
        this.getWorkPage(this.state.work_page + 1)
        break
      case "bookmark":
        this.getBookmarkPage(this.state.bookmark_page + 1)
        break
    }
  }

  getWorkPage(page) {
    axios.get('/api/work/creator/1/'+page)
        .then(function (response) {
          this.setState({
            works: response.data.works,
            work_page: page,
            work_pages: response.data.pages
          });
        }.bind(this))
        .catch(function (error) {
          console.log(error);
        });
  }

  getBookmarkPage(page) {
    axios.get('/api/bookmark/curator/'+this.state.curator.curator_id+'/'+page)
        .then(function (response) {
          this.setState({
            bookmarks: response.data.bookmarks,
            bookmark_page: page,
            bookmark_pages: response.data.pages
          });
        }.bind(this))
        .catch(function (error) {
          console.log(error);
        });
  }

    getWorks(index, userId)
    {
    	axios.get('/api/work/creator/'+userId)
          .then(function (response) {
            this.setState({
              works: response.data.works,
              work_pages: response.data.pages
            });

          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
    }
    getBookmarks(index, userId)
    {
    	axios.get('/api/bookmark/curator/'+userId)
          .then(function (response) {
            var curator = {}
            if (response.data.bookmarks.length > 0) {
              curator = response.data.bookmarks[0].curator
            }
            this.setState({
              bookmarks: response.data.bookmarks,
              curator: curator,
              bookmark_pages: response.data.pages
            });

          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
    }

    editMyAccount(evt) {
			var pathname = "/user/"+this.state.user.id+"/edit";
			var csrf = this.props.csrf
      this.props.history.push({
				pathname: pathname,
	      state: { csrf: csrf}
			});
    }
    deleteMyAccount(evt) {
      this.props.history.push("/user/"+this.state.user.id+"/edit");
    }
    componentDidMount() {
    	this.getUser();
  	}

    componentWillUpdate(nextProps, nextState)
    {
    }

    componentWillMount() {
    }

    render() {
      const actions = []
      var action = {}
      action.actionToDo = this.editMyAccount;
      action.actionText="Edit";
      action.variables=[]
      actions.push(action)
      var deleteAction = {}
      deleteAction.actionToDo = this.deleteMyAccount;
      deleteAction.actionText="Delete";
      actions.push(deleteAction)
    return (
    	<div>
        <div className="row">
          <div className="col-xs-10">
      		  <UserContainer user={this.state.user} works={this.state.works} bookmarks={this.state.bookmarks}
            curator={this.state.curator} totalWorkPages={this.state.work_pages} totalBookmarkPages={this.state.bookmark_pages}
            currentWorkPage={this.state.work_page} currentBookmarkPage={this.state.bookmark_page} previousPage={this.previousPage} nextPage={this.nextPage}/>
      	  </div>
          <div className="col-xs-2">
            <EditDeleteButtons dropdownLabel="Actions" actions={actions}/>
          </div>
        </div>
      </div>
    );
  }

}
export default withAlert(withRouter(MyProfile))