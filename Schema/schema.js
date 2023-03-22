/* eslint-disable no-unused-vars */
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLEnumType,
} = require('graphql');

const Client = require('../Model/clients/client');
const Project = require('../Model/projects/project');

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
                return Client.findById(parent.clientId);
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
                console.log(arg);
                return Client.findById(arg.id);
            },
        },
        clients: {
            type: new GraphQLList(ClientsType),
            resolve(parent, arg) {
                return Client.find();
            },
        },
        project: {
            type: ProjectsType,
            args: { id: { type: GraphQLID } },
            resolve(parent, arg) {
                return Project.findById(arg.id);
            },
        },
        projects: {
            type: new GraphQLList(ProjectsType),
            resolve() {
                return Project.find();
            },
        },
    },
});

// mutation
const mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        // add Client
        addClient: {
            type: ClientsType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, arg) {
                const client = new Client({
                    name: arg.name,
                    email: arg.email,
                    phone: arg.phone,
                });
                await client.save();
                return client;
            },
        },
        updateClient: {
            type: ClientsType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
            },
            async resolve(parent, args) {
                console.log('rachked ', args);
                const updatedClient = await Client.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            email: args.email,
                            phone: args.phone,
                        },
                    },
                    {
                        new: true,
                    }
                );

                return updatedClient;
            },
        },
        // delete Client
        deleteClient: {
            type: ClientsType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                const projects = await Project.find({ clientId: args.id });
                projects.forEach(async (project) => {
                    await project.deleteOne();
                });

                const deleted = await Client.findByIdAndRemove(args.id);
                return deleted;
            },
        },

        addProject: {
            type: ProjectsType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            new: { value: 'Not Started' },
                            progress: { value: 'In Progress' },
                            completed: { value: 'Completed' },
                        },
                    }),
                    defaultValue: 'Not Started',
                },
                clientId: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });

                await project.save();
                return project;
            },
        },

        deleteProject: {
            type: ProjectsType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            async resolve(parent, args) {
                const deletedProject = await Project.findByIdAndRemove(args.id);

                return deletedProject;
            },
        },

        updateProject: {
            type: ProjectsType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            new: { value: 'Not Started' },
                            progress: { value: 'In Progress' },
                            completed: { value: 'Completed' },
                        },
                    }),
                },
            },
            async resolve(parent, args) {
                const updatedProject = await Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status,
                        },
                    },
                    {
                        new: true,
                    }
                );

                return updatedProject;
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation,
});
