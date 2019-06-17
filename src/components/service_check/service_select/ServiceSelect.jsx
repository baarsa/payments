import React, { useState } from 'react';
import gql from 'graphql-tag';
import Select from 'react-dropdown-select';
import { Query, Mutation } from 'react-apollo';
import Crt from 'react-select/creatable';

const CREATE_SERVICE = gql`
    mutation createService($name: String) {
        createService(serviceName: $name) {
            id
            name
        }
    }
`;

const GET_SERVICES = gql`
    query getServices {
        allServices {
            id
            name
        }
    }
`;

const QueryWrap = ({ value, setValue }) => {     
    return <div>        
        <Query query={GET_SERVICES}>
    {({ loading, error, data }) => <ServiceSelect services={data.allServices} value={value} setValue={setValue} />}
</Query></div>};

const ServiceSelect = ({ services, value, setValue }) => <Mutation mutation={CREATE_SERVICE}>
    {(createService) => (
        <Crt 
        getOptionLabel={opt => opt.name}
        getOptionValue={opt => opt.id}
        options={services}        
        onCreateOption={(name) => createService({variables: { name }})} 
        values={value}
        onChange={(v) => setValue(v.id)}
        />
    )}
</Mutation>

export default QueryWrap;
