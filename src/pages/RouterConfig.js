import Vue from "vue";
import Router from "vue-router";
import Nodes from "@/pages/nodes/Nodes";
import Node from "@/pages/nodes/Node";
import NodeTags from "@/pages/nodes/Tags";
import Charts from "@/pages/nodes/Charts";
import Servers from "@/pages/servers/Servers";
import NewServer from "@/pages/servers/New";
import EditServer from "@/pages/servers/Edit";
import Tags from "@/pages/tags/Tags";
import NewTag from "@/pages/tags/New";
import EditTag from "@/pages/tags/Edit";
import Users from "@/pages/users/Users";
import UserTags from "@/pages/users/Tags";
import NewUser from "@/pages/users/New";
import EditUser from "@/pages/users/Edit";
import Versions from "@/pages/versions/Versions";
import NewVersion from "@/pages/versions/New";
import EditVersion from "@/pages/versions/Edit";
import Events from "@/pages/events/Events";
import NewEvent from "@/pages/events/New";
import EditEvent from "@/pages/events/Edit";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/nodes"
    },
    {
      path: "/nodes",
      component: Nodes
    },
    {
      path: "/nodes/:id",
      component: Node
    },
    {
      path: "/nodes/:id/tags",
      component: NodeTags
    },
    {
      path: "/nodes/:id/charts",
      component: Charts
    },
    {
      path: "/nodes/:id/events/new",
      component: NewEvent
    },
    {
      path: "/nodes/:nodeId/events/:eventId/edit",
      component: EditEvent
    },
    {
      path: "/servers",
      component: Servers
    },
    {
      path: "/servers/:id/edit",
      component: EditServer
    },
    {
      path: "/servers/new",
      component: NewServer
    },
    {
      path: "/tags",
      component: Tags
    },
    {
      path: "/tags/:id/edit",
      component: EditTag
    },
    {
      path: "/tags/new",
      component: NewTag
    },
    {
      path: "/users",
      component: Users
    },
    {
      path: "/users/:id/tags",
      component: UserTags
    },
    {
      path: "/users/:id/edit",
      component: EditUser
    },
    {
      path: "/users/new",
      component: NewUser
    },
    {
      path: "/versions",
      component: Versions
    },
    {
      path: "/versions/:id/edit",
      component: EditVersion
    },
    {
      path: "/versions/new",
      component: NewVersion
    },
    {
      path: "/events",
      component: Events
    },
    {
      path: "/events/:eventId/edit", // didn't use :id since this component is also used by "nodes/:nodeId/events/:eventId/edit"
      component: EditEvent
    },
    {
      path: "/events/new",
      component: NewEvent
    }
  ]
});
