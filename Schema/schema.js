/* eslint-disable no-unused-vars */
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
} = require('graphql');
const { clients, projects } = require('../db/db');

// Clients types
const ClientsType = new GraphQLObjectType({
    name: 'clients',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLID },
    }),
});

// Products type
const ProjectsType = new GraphQLObjectType({
    name: 'Projects',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientsType,
            resolve(parent, arg) {
                return clients.find((client) => client.id === parent.clientId);
            },
        },
    }),
});

const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        client: {
            type: ClientsType,
            args: { id: { type: GraphQLID } },
            resolve(parent, arg) {
                return clients.find((clint) => clint.id === arg.id);
            },
        },
        clients: {
            type: new GraphQLList(ClientsType),
            resolve(parent, arg) {
                return clients;
            },
        },
        project: {
            type: ProjectsType,
            args: { id: { type: GraphQLID } },
            resolve(parent, arg) {
                return projects.find((project) => project.id === arg.id);
            },
        },
        projects: {
            type: new GraphQLList(ProjectsType),
            resolve() {
                return projects;
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
});
