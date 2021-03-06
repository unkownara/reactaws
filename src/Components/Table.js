import React from 'react';
import axios from 'axios';
import {
    Table,
    Button,
    Input
} from 'semantic-ui-react';
import Loader from "./Loader";
import { useInput } from './useInput';
import '../App.css';

export default class TableComponent extends React.Component {

    state = {
        dataList: [],
        isError: false,
        isLoaded: false
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
                dataList : res.data.Items,
                isLoaded: true
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

    newRecord = (obj) => {
        let self = this;
        let newObj = { id: obj.id, name: obj.name, city: obj.city, state: obj.state, status: 'active' };
        this.setState({
            dataList: [...this.state.dataList, newObj]
        }, function() {
            axios({
                url: 'https://0fadggmpo7.execute-api.us-east-2.amazonaws.com/beta/sample-api',
                method: 'POST',
                data: {
                    postInfo: newObj
                },
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }).then(res => {
                if(res.data !== true) {
                    self.setState({
                        isError: true
                    });
                } else {
                    self.setState({
                        isError: false
                    })
                }
            }).catch(err => {
                self.setState({
                    isError: true
                })
            });
        });
    };

    render() {
        const {
            isError,
            dataList
        } = this.state;
        if(this.state.isLoaded) {
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
                        <TableInput length={dataList.length} newRecord={this.newRecord}/>
                {this.state.dataList.length > 0 ? <TableHeader dataList={dataList}/> : <NoDataFound /> }
                    </div>
                );
            }
        } else {
            return <div className="centerAlignment">
                    <Loader dimensions={'30px'} />
                </div>
        }
    }
}

const NoDataFound = () => {
    return (
        <div className="centerAlignment">
           <h4 style={{ fontSize: 20, marginTop: '100px' }}> No data found. Add user data. </h4>
        </div>
    )
}

const TableInput = (props) => {
    const id = props.length + 1;
    const name = useInput('');
    const city = useInput('');
    const state = useInput('');
    
    const onSubmit = e => {
        let obj = {
            id: id.toString(),
            name: name.value,
            city: city.value,
            state: state.value
        };
        props.newRecord(obj);
    };

    return (
        <div>
            <Input
                {...name}
                placeholder={'Name'}
                className="inputField"
            />
            <Input
                {...city}
                placeholder={'City'}
                className="inputField"
            />
            <Input
                {...state}
                placeholder={'State'}
                className="inputField"
            />
            <Button primary size="medium" onClick={onSubmit}>
                Submit
            </Button>
        </div>
    )
}

const TableHeader = (props) => {
    return (
        <div style={{ marginTop: '30px' }}>
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
        dataList: this.props.dataList,
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
        console.log('heare', this.state.dataList);

        if (this.state.dataList.length <= 0)
            return null;
        else {
            console.log('heare')
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