import React from 'react';
import axios from 'axios';
import {
    Table,
    Button
} from 'semantic-ui-react';
import Loader from "./Loader";

export default class TableComponent extends React.Component {

    state = {
        dataList: [],
        isError: false
    };

    componentDidMount() {
        var self = this;
        const url = "https://0fadggmpo7.execute-api.us-east-2.amazonaws.com/beta/sample-api";
        axios.get(url, {
           params: {
               status: 'active'
           },
            header: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }).then(res => {
            self.setState({
                dataList : res.data.Items
            })
        }).catch(err => {
            self.setState({
                isError: true
            })
        });
    }

    retry = () => {
        window.location.reload();
    };

    render() {
        const {
            isError,
            dataList
        } = this.state;

        if(isError) {
            return (
                <div className="centerAlignment">
                    <div>
                        <h1> Oops... Please check your network (: </h1>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <Loader dimensions={'20px'}/>
                    </div>
                    <div className="centerAlignment" style={{ marginTop: '100px' }}>
                        <Button primary onClick={this.retry}> Retry </Button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="centerAlignment">
                    <TableHeader dataList={dataList}/>
                </div>
            );
        }
    }
}

const TableHeader = (props) => {
    return (
        <div>
            <Table basic='very'
                   columns={6}
                   size='large'
                   selectable={true}
                   className="space_between_two_component"
                   celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{paddingLeft: '25px'}}>S.No</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>City</Table.HeaderCell>
                        <Table.HeaderCell>State</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <TableContent dataList={props.dataList} selectedRow={props.selectedRow}/>
                </Table.Body>
            </Table>
        </div>
    );
};

class TableContent extends React.Component {

    state = {
        dataList: [],
        editableRowId : null,
        name: '',
        state: '',
        city: ''
    };

    componentWillReceiveProps(props) {
        this.setState({
            dataList: props.dataList
        })
    }

    selectedRow = (data) => {
        console.log('Row data ', data);
        setInterval(() => {
            window.location.reload();
        }, 3000);
    };

    editRow = (data) => {
        this.setState({
            editableRowId: data.id,
            name: data.name,
            state: data.state,
            city: data.city
        })
    };

    nameOnChange = (e) => {
        this.setState({
            name: e.target.value
        })
    };

    cityOnChange = (e) => {
        this.setState({
            city: e.target.value
        })
    };

    stateOnChange = (e) => {
        this.setState({
            state: e.target.value
        })
    };

    selectedEditedRow = () => {
        if(this.state.editableRowId !== null) {
            let obj = {
                id: this.state.editableRowId,
                name: this.state.name,
                city: this.state.city,
                state: this.state.state
            };
            axios({
                url: 'https://0fadggmpo7.execute-api.us-east-2.amazonaws.com/beta/sample-api/update/',
                method: "POST",
                data : {
                    postInfo: obj
                },
                header: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }).then(res => {
            }).catch(err => {
            });
            let newDataList = Object.assign(this.state.dataList);
            newDataList[this.state.editableRowId-1] = obj;
            console.log('Edited row ', obj);
            this.setState({
                editableRowId: null,
                dataList: newDataList
            });
        }
    }

    render() {
        let {
            editableRowId
        } = this.state;

        if (this.state.dataList.length <= 0)
            return null;
        else {
            return (
                this.state.dataList && this.state.dataList.length > 0 && this.state.dataList.map((info, index) => {
                    {
                        if(editableRowId !== info.id) {
                        return (
                            <React.Fragment key={index}>
                                <Table.Row key={index}>
                                    <Table.Cell textAlign='center' width={1}>{info.id} .</Table.Cell>
                                    <Table.Cell width={4}>{info.name}</Table.Cell>
                                    <Table.Cell width={2}>{info.city}</Table.Cell>
                                    <Table.Cell width={1}>{info.state}</Table.Cell>
                                    <Table.Cell width={1}>
                                        <Button primary onClick={() => this.selectedRow(info)}> Submit</Button>
                                    </Table.Cell>
                                    <Table.Cell width={1}>
                                        <Button onClick={() => this.editRow(info)}> Edit </Button>
                                    </Table.Cell>
                                </Table.Row>
                            </React.Fragment>
                        );
                    } else {
                        return (
                            <React.Fragment key={index}>
                                <Table.Row key={index}>
                                    <Table.Cell textAlign='center' width={1}>{info.id} .</Table.Cell>
                                    <Table.Cell width={4}><input value={this.state.name} onChange={this.nameOnChange}></input></Table.Cell>
                                    <Table.Cell width={2}><input value={this.state.city} onChange={this.cityOnChange}></input></Table.Cell>
                                    <Table.Cell width={1}><input value={this.state.state} onChange={this.stateOnChange}></input></Table.Cell>
                                    <Table.Cell width={1}>
                                        <Button primary onClick={() => this.selectedEditedRow(info.id)}> Submit</Button>
                                    </Table.Cell>
                                    {/* <Table.Cell width={1}>
                                        <Button onClick={() => this.editRow(info)}> Edit </Button>
                                    </Table.Cell> */}
                                </Table.Row>
                            </React.Fragment>
                        )
                    }
                    }
                })
            );
        }
    }
}