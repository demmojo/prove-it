import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import forge from 'node-forge';
import UploadForm from '../../components/Forms/UploadForm/UploadForm';
import DetailCard from '../../components/Cards/DetailCard/DetailCard';
import PreviewCard from '../../components/Cards/PreviewCard/PreviewCard';
import WarningModal from '../../components/Modals/WarningModal';
import Prove from '../../../build/contracts/Prove.json';
import Register from '../../../build/contracts/Register.json';
import getWeb3 from '../../utils/getWeb3';
import getContract from '../../utils/getContract';
import ipfs from '../../utils/ipfs';
import Spinner from '../../components/Spinner/Spinner';

class Upload extends Component {

    state = {
        web3: null,
        name: '',
        timestamp: '',
        docTags: '',
        fileInput: '',
        fileBuffer: '',
        docHash: '',
        isUploaded: false,
        loading: false,
        prefill: {}
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.
        getWeb3.then(results => {
            //add comments here
            const publicAddress = results.web3.eth.coinbase.toLowerCase();
            const proveInstance = getContract(Prove);
            const registerInstance = getContract(Register);
            console.log(" Upload componentWillMount  this: ", this);

            this.setState({
                web3: results.web3,
                loading: false,
                publicAddress: publicAddress,
                proveInstance: proveInstance,
                registerInstance: registerInstance
            })

        }).catch(() => {
            console.log('Error finding web3.')
        });
    }

    toggleWarning = () => {
        this.setState({
            warning: !this.state.warning,
        });
    }

    handleReset = () => {
        console.log("Inside handleReset ")
        document.getElementById("document-uplaod-form").reset();
        this.setState({ name: '', docTags: '', timestamp: '', fileInput: '', imagePreviewUrl: '', docHash: '', blockchainDigest: '', fileBuffer: '' });
        console.log(this.state)
    }

    handleSubmit = (event) => {
        event.preventDefault();
        // const powInstance = this.powInstance;
        console.log("Clicked Submit button: ");
        console.log(this.state);
        this.setState({ loading: true, uploadedInIpfs: false });
        ipfs.files.add(this.state.fileBuffer, (error, result) => {

            if (error) {
                this.setState({
                    loading: false
                })
                console.error(error);
                window.alert(error)
                return;
            }

            this.setState({
                loading: false, ipfsHash: result[0].hash, uploadedInIpfs: true
            })
            console.log("submit button this :", this.state);
            console.log("ipfs API result =", result)
            console.log("File Has been uploaded to IPFS", result[0]);

            this.state.web3.eth.getAccounts((error, accounts) => {
                if (error) {
                    console.error(error);
                    window.alert(error)
                    return;
                }

                this.state.registerInstance.deployed().then((instance) => {
                    return instance.getCurrentVersion.call({ from: this.state.publicAddress });
                }).then((currentContractAddress) => {
                    console.log("registerInstance  current address : ", currentContractAddress)
                    return currentContractAddress;
                }).then((proveLogicAddress) => {
                    this.proveOfLogicInst = this.state.proveInstance.at(proveLogicAddress);
                    return this.proveOfLogicInst;
                }).then((proveInstance) => {
                    console.log("Inside proveLogic1")
                    console.log("user name = ", this.state.name);
                    console.log("DocTags string = ", this.state.docTags);
                    const docTagsTemp = this.state.docTags;

                    return proveInstance.uploadFile(
                        this.state.docHash,
                        this.state.web3.fromAscii(this.state.name),
                        this.state.web3.fromAscii(this.state.ipfsHash),
                        docTagsTemp,
                        { from: this.state.publicAddress });

                }).then((result) => {
                    window.alert("File upload request has been submitted to the blockchain");
                    console.log("prove upload result: ", result);
                    console.log("state = ", this.state);
                    return this.proveOfLogicInst.retrieveFile.call(this.state.docHash, { from: this.state.publicAddress });
                }).then((downloadFileResult) => {
                    console.log("proveLogic download result: ", downloadFileResult);
                    this.setState({ loading: false })
                    window.alert(this.state.docHash + " document has been uploaded and added to the blockchain")
                }).catch((error) => {
                    console.log("----------------error---------------")
                    console.log(error)
                    window.alert(error)
                })
            });
        }); // ipfs add closing tag

    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        if (name !== "fileInput" && value.length !== 0) {
            this.setState({ [name]: value });
        } else {
            console.log("empty data nothing to set")
        }
    }

    handleImageChange = (e) => {
        e.preventDefault();
        console.log("inside _handleImageChange ")

        let file = e.target.files[0];
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
        } else {
            console.log('There is no image file selected')
            this.setState({ fileInput: '', fileBuffer: '' });
        }
    }

    render() {

        const prefill = this.state.prefill;
        let { fileBuffer } = this.state;
        let $imagePreview = null;
        let $modal = null;
        let ipfsUrl = null
        if (this.state.ipfsHash) {
            ipfsUrl = 'https://ipfs.infura.io/ipfs/' + this.state.ipfsHash;
        }

        if (fileBuffer) {
            $imagePreview = (
                <div>
                    {/* <PreviewCard fileBuffer={ipfsUrl} /> */}
                    <PreviewCard fileBuffer={this.state.imagePreviewData} />
                    <DetailCard
                        fileInput={this.state.fileName}
                        name={this.state.name}
                        docTags={this.state.docTags}
                        timestamp={this.state.timestamp}
                        docHash={this.state.docHash}
                        ipfsHash={this.state.ipfsHash} />
                </div>
            );
        }

        if (this.state.isUploaded) {
            console.log('ipfsUrl: ' + ipfsUrl);
            $modal = (
                <div>
                    <WarningModal
                        warning={this.state.warning}
                        toggleWarning={this.toggleWarning}
                        message="The document does not exist in blockchain"
                    />);
            </div>
            );
        }

        if (this.state.loading === false) {
            return (
                <div>
                    <Container fluid>
                        <Row>
                            <Col xs="12" md="6" xl="6">
                                <UploadForm
                                    name={prefill.name}
                                    handleSubmit={this.handleSubmit}
                                    handleReset={this.handleReset}
                                    handleChange={this.handleChange}
                                    handleImageChange={this.handleImageChange} />
                            </Col >
                            <Col xs="12" md="6" xl="6">
                                {$imagePreview}
                                {$modal}
                            </Col>
                        </Row>
                    </Container>
                </div>
            )
        } else {
            return (
                <div className="col align-self-center">
                    <Spinner />
                </div>
            )
        }
    }
}

export default Upload;