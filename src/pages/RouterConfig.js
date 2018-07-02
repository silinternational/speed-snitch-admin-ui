import Vue from "vue";
import Router from "vue-router";
import Nodes from "@/pages/nodes/Nodes";
import Node from "@/pages/nodes/Node";
import NodeTags from "@/pages/nodes/Tags";
import Charts from "@/pages/nodes/Charts";
import Servers from "@/pages/servers/Servers";
import Server from "@/pages/servers/Server";
import NewServer from "@/pages/servers/New";
import Tags from "@/pages/tags/Tags";
import Tag from "@/pages/tags/Tag";
import NewTag from "@/pages/tags/New";
import Users from "@/pages/users/Users";
import User from "@/pages/users/User";
import UserTags from "@/pages/users/Tags";
import NewUser from "@/pages/users/New";
import Versions from "@/pages/versions/Versions";
import Version from "@/pages/versions/Version";
import NewVersion from "@/pages/versions/New";

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
      path: "/nodes/:macaddr",
      component: Node
    },
    {
      path: "/nodes/:macaddr/tags",
      component: NodeTags
    },
    {
      path: "/nodes/:macaddr/charts",
      component: Charts
    },
    {
      path: "/servers",
      component: Servers
    },
    {
      path: "/servers/new",
      component: NewServer
    },
    {
      path: "/servers/:id",
      component: Server
    },
    {
      path: "/tags",
      component: Tags
    },
    {
      path: "/tags/new",
      component: NewTag
    },
    {
      path: "/tags/:id",
      component: Tag
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
      path: "/users/new",
      component: NewUser
    },
    {
      path: "/users/:id",
      component: User
    },
    {
      path: "/versions",
      component: Versions
    },
    {
      path: "/versions/new",
      component: NewVersion
    },
    {
      path: "/versions/:id",
      component: Version
    }
  ]
});
