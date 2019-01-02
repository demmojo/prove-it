import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import forge from 'node-forge';
import DetailCard from '../../components/Cards/DetailCard/DetailCard';
import PreviewCard from '../../components/Cards/PreviewCard/PreviewCard';
import VerificationForm from '../../components/Forms/VerificationForm/VerificationForm';
import WarningModal from '../../components/Modals/WarningModal';
import getWeb3 from '../../utils/getWeb3';
import Prove from '../../../build/contracts/Prove.json';
import Register from '../../../build/contracts/Register.json';
import getContract from '../../utils/getContract';

class Verify extends Component {

    state = {
        storageValue: 0,
        web3: null,
        name: '',
        dateInput: '',
        fileInput: '',
        imagePreviewUrl: null,
        success: false,
        warning: false,
        info: false,
        docHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        contractResponse: {
            docHash: '',
            name: "",
            timestamp: "",
            ipfsHash: '',
            docTags: '',
            isPresent: null
        }
    }

    toggle = () => {
        this.setState({
            info: !this.state.info,
        });
    }

    toggleSuccess = () => {
        this.setState({
            success: !this.state.success,
        });
    }

    toggleWarning = () => {
        this.setState({
            warning: !this.state.warning,
        });
    }

    toggleInfo = (e) => {
        e.preventDefault();
        //console.log("Inside toggleInfo; info=" + !this.state.info)
        this.setState({
            info: !this.state.info,
        });
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        getWeb3.then(results => {
            const publicAddress = results.web3.eth.coinbase.toLowerCase();
            const proveLogicInstance = getContract(Prove);
            const registerInstance = getContract(Register);
            console.log(" Verify componentWillMount  this: ", this);

            this.setState({
                web3: results.web3,
                publicAddress: publicAddress,
                proveLogicInstance: proveLogicInstance,
                registerInstance: registerInstance
            })
        })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    handleReset = () => {
        console.log("Inside handleReset ")
        document.getElementById("document-verification-form").reset();
        document.getElementById("PreviewCard").reset();
        document.getElementById("DetailsCard").reset();
        this.setState({ docHash: '', name: '', fileInput: '', imagePreviewUrl: '', contractResponse: {} });
        console.log(this.state)
    }

    handleSubmit = (event) => {
        console.log("Clicked on Submit button ");
        console.log(this.state);
        this.instantiateContract();
    }

    handleImageChange = (event) => {
        event.preventDefault();
        console.log("inside handleImageChange function")
        let name = event.target.name;
        let value = event.target.value;
        if (name !== "fileInput" && value.length !== 0) {
            // convet the text fields in to hex string so that they can be handled as byte arrays in solidity contracts
            this.setState({ [name]: value });
        } else {  // implement generating dochash from fileinput and setting state here
            console.log("inside _handleImageChange ")

            let file = event.target.files[0];
            let reader = new window.FileReader();
            let readerPreview = new window.FileReader();
            console.log("Upload: handle image change: file", file);

            if (file) {
                // Create file buffer array to upload in IPFS
                reader.readAsArrayBuffer(file);
                reader.onloadend = () => {
                    var md = forge.md.sha256.create();
                    md.update(Buffer(reader.result));
                    //var hash = this.state.web3.sha3(Buffer(reader.result).tostring());
                    let docHash = '0x' + md.digest().toHex();
                    console.log("docHash: ", docHash);
                    this.setState({ fileInput: file.name, fileBuffer: Buffer(reader.result), docHash: docHash });
                    console.log('buffer:', this.state.fileBuffer);
                    //var docHash = docHash;
                    console.log("docHash: ", docHash);
                }
                // Create file data stream to display in the preview component
                readerPreview.readAsDataURL(file);
                readerPreview.onloadend = () => {
                    this.setState({ imagePreviewData: readerPreview.result })
                    console.log("Upload: image change: state: ", this.state)
                }
            // } else {
            //     console.log('There is no image file selected')
            //     this.setState({ fileInput: '', fileBuffer: '' });
            // }
            this.setState({ [name]: value });  
            }
        }
            
        console.log(this.state)
    }

    instantiateContract = () => {
        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {

            if (error) {
                console.error("Instantiating contract error", error);
                window.alert(error)
                return;
            }

            this.state.registerInstance.deployed().then((instance) => {
                return instance.getCurrentVersion.call({ from: this.state.publicAddress });
            }).then((currentContractAddress) => {
                console.log("registerInstance  current address : ", currentContractAddress)
                return currentContractAddress;
            }).then((proveLogicAddress) => {
                this.proveOfLogicInst = this.state.proveLogicInstance.at(proveLogicAddress);
                return this.proveOfLogicInst;
            }).then((proveLogicInstance) => {
                console.log("Inside proveLogic1")
                console.log("docHash", this.state.docHash)
                return this.proveOfLogicInst.retrieveFile.call(this.state.docHash, { from: this.state.publicAddress });
            }).then((result) => {
                console.log("proveLogic download result: ", result);
                if (result[0] !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                    console.log("result state set")
                    var utcSeconds = result[2].valueOf();
                    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                    d.setUTCSeconds(utcSeconds);
                    return this.setState({
                        contractResponse: {
                            hash: result[0],
                            name: this.state.web3.toUtf8(result[1]),
                            timestamp: d.toLocaleString(),
                            ipfsHash: this.state.web3.toAscii(result[3]),
                            docTags: this.state.web3.toAscii(result[4]),
                            isPresent: true
                        },
                        warning: false
                    });
                } else {
                    console.log("result2 = empty")
                    return this.setState({
                        contractResponse: {
                            hash: result[0],
                            name: result[1],
                            timestamp: result[2],
                            ipfsHash: result[3],
                            isPresent: false
                        }, warning: true
                    })
                }
            }).catch((error) => {
                console.log("----------------error---------------")
                console.log(error)
                window.alert(error)
            })
        })
    }

    render() {

        let imagePreviewUrl = this.state.docHash;
        let $imagePreview = null;
        console.log("Verify render state: ", this.state);
        let ipfsUrl = null;

        if (imagePreviewUrl !== null && this.state.contractResponse.isPresent === true) {
            console.log("File exists in blockchain")
            console.log("ipfsHash : ", this.state.contractResponse.ipfsHash);
            if (this.state.contractResponse.ipfsHash) {
                console.log("setting ipfs URL")
                ipfsUrl = 'https://ipfs.infura.io/ipfs/' + this.state.contractResponse.ipfsHash;
            }
            console.log('ipfsUrl : ' + ipfsUrl);
            $imagePreview = (
                <div>
                    <PreviewCard fileBuffer={ipfsUrl} />
                    <DetailCard
                        fileInput={this.state.contractResponse.fileInput}
                        name={this.state.contractResponse.name}
                        docTags={this.state.contractResponse.docTags}
                        timestamp={this.state.contractResponse.timestamp}
                        docHash={this.state.contractResponse.hash}
                        ipfsHash={this.state.contractResponse.ipfsHash} />
                </div>
            );
        } else {
            if (this.state.contractResponse.isPresent === false) {
                console.log("File does not exist in blockchain")
                $imagePreview = (
                    <WarningModal
                        warning={this.state.warning}
                        toggleWarning={this.toggleWarning}
                        message="This file does not exist on the blockchain"
                    />);
            }
        }

        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col xs="12" md="6" xl="6">
                            <VerificationForm
                                handleImageChange={this.handleImageChange}
                                handleSubmit={this.handleSubmit}
                                handleReset={this.handleReset} />
                        </Col >
                        <Col xs="12" md="6" xl="6">
                            {$imagePreview}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Verify;