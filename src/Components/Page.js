import React, { Component } from 'react'
import { Navbar, NavbarToggler, NavbarBrand, } from 'reactstrap';
import { Card, CardBody } from 'reactstrap';
import ReactFontLoader from 'react-font-loader'
import Bcon from '../assets/bcon.png'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';


class Page extends Component {

    constructor(props) {
        super(props)

        this.state = {
            form: {
                inputBase: "",
                inputNumber: "",
                outputBase: "",
            },
            formErrorMessage: {
                inputBaseError: "",
                inputNumberError: "",
                outputBaseError: ""
            },
            formValid: {
                inputBase: false,
                inputNumber: false,
                outputBase: false,
                buttonActive: false
            },
            outputNumber: ""
        }
    }


    resetState = (e) => {
        var baseForm = {
            inputBase: "",
            inputNumber: "",
            outputBase: ""
        }

        var baseformErrorMessage = {
            inputBaseError: "",
            inputNumberError: "",
            outputBaseError: ""
        }

        var baseformValid = {
            inputBase: false,
            inputNumber: false,
            outputBase: false,
            buttonActive: false
        }

        this.setState({ form: baseForm, formErrorMessage: baseformErrorMessage, formValid: baseformValid, outputNumber: "" })
    }



    decimalSplitter = (inputNumber, inputBase) => {
        var inputNumberString = inputNumber.toString()
        var numberString = ''
        var decimalString = ''
        var baseArray = []
        var numberDecimalArr = []
        if (inputNumberString.indexOf('.') === -1) {
            var pushOverNumber = this.validateNumber(inputNumber, inputBase)
            if (pushOverNumber) {
                numberDecimalArr[0] = pushOverNumber
            }
            return numberDecimalArr
        }
        else {
            baseArray = inputNumberString.split('.')
            numberString = baseArray[0]
            decimalString = baseArray[1]
            let pushOverNumber = this.validateNumber(numberString, inputBase)
            let pushOverDecimal = this.validateDecimal(decimalString, inputBase)
            if (pushOverNumber && pushOverDecimal) {
                numberDecimalArr[0] = pushOverNumber
                numberDecimalArr[1] = pushOverDecimal
            }
            return numberDecimalArr
        }
    }

    validateNumber = (numberString, base) => {
        var masterArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
        var baseNumberArr = []
        var numberArr = numberString.toString().split("")
        var numberStringV = ''
        while (numberArr[0] === "0" && numberArr.length > 1) {
            numberArr.shift()
        }

        if (numberArr === ['0']) {
            numberStringV = '0'
            return numberStringV
        }
        else {
            var i = 0
            while (i < base) {
                baseNumberArr.push(masterArr[i])
                i++
            }
            numberStringV = numberArr.join("")
            for (var num of numberArr) {
                if (baseNumberArr.indexOf(num) === -1) {
                    return null
                }
                else {
                    continue
                }
            }
            return numberStringV
        }

    }


    validateDecimal = (decimalString, base) => {
        var masterArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
        var baseDecimalArr = []
        var decimalArr = decimalString.toString().split("")
        var decimalStringV = ''
        while (decimalArr[decimalArr.length - 1] === "0" && !decimalArr[decimalArr.length - 2] === 0) {
            decimalArr.pop()
        }
        var j = 0
        while (j < base) {
            baseDecimalArr.push(masterArr[j])
            j++
        }
        decimalStringV = decimalArr.join('')
        for (var dec of decimalArr) {
            if (baseDecimalArr.indexOf(dec) === -1) {
                return null
            }
            else {
                continue
            }
        }
        return decimalStringV
    }

    handleSubmit = (e) => {
        e.preventDefault()
        var splittedArr = this.decimalSplitter(this.state.form.inputNumber, this.state.form.inputBase)
        var convertedNumber = this.numberToBaseTen(splittedArr[0], this.state.form.inputBase)
        if (convertedNumber === "") {
            convertedNumber += '0'
        }
        var output = ""
        if (splittedArr.length === 2) {
            var convertedDecimal = this.decimalToBaseTen(splittedArr[1], this.state.form.inputBase)
            output = convertedNumber + '.' + convertedDecimal
        }
        else {
            output = convertedNumber
        }
        this.setState({ outputNumber: output })
    }


    numberToBaseTen = (numberString, inputBase) => {
        var masterArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
        var valueArr = []
        var numberArr = numberString.toString().split("")
        var value = 0
        for (var num of numberArr) {
            valueArr.push(masterArr.indexOf(num))
        }
        for (var val in valueArr) {
            value = value + Math.pow(Number(inputBase), valueArr.length - val - 1) * valueArr[val]
        }

        var finalString = this.numberTenToAny(value, this.state.form.outputBase)
        return finalString

    }

    numberTenToAny = (tenNum, outputBase) => {

        var masterArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
        var remArr = []
        var finalArr = []
        var inpNum = tenNum
        var quotient
        while (!inpNum == 0) {
            quotient = Math.floor(inpNum / outputBase)
            rem = inpNum % outputBase
            remArr.push(rem)
            inpNum = quotient
        }
        remArr.reverse()

        for (var rem of remArr) {
            finalArr.push(masterArr[rem])
        }
        var finalStr = ""
        for (var fin of finalArr) {
            finalStr += fin
        }
        return finalStr
    }

    decimalToBaseTen = (decimalString, inputBase) => {
        var masterArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
        var valueArr = []
        var i = 0

        var length = decimalString.length
        var decimalArr = decimalString.split("")
        for (var deci of decimalArr) {
            valueArr.push(Number(masterArr.indexOf(deci)))
        }

        var toTenDecimal = 0
        var count = 1
        var fraction = Number(decimalString) / Math.pow(10, length)
        for (var val in valueArr) {
            toTenDecimal += valueArr[val] * Math.pow(inputBase, -(count))
            count++
        }
        var toTenDecimalStr = toTenDecimal.toString().substring(2)
        return this.decimalTenToAny(toTenDecimalStr, this.state.form.outputBase)

    }


    decimalTenToAny = (decimalTen, outputBase) => {
        var masterArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
        var baseDeci = Number(decimalTen) / Math.pow(10, decimalTen.length)
        var valueArr = []
        var forwardDeci = 0
        var k = 0
        while (k < 10) {
            forwardDeci = Math.floor((baseDeci * outputBase) / 1)
            valueArr.push(masterArr[forwardDeci.toString()])
            baseDeci = (baseDeci * outputBase) % 1
            k++
        }
        var decimalValue = valueArr.join("")
        return decimalValue
    }

    handleChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { form } = this.state;
        this.setState({ form: { ...form, [name]: value } });
        this.validateField(name, value);
    };

    validateField = (name, value) => {
        let fieldValidationErrors = this.state.formErrorMessage;
        let formValid = this.state.formValid;

        switch (name) {
            case "inputBase":
                if (value === "") {
                    fieldValidationErrors.inputBaseError = "field required";
                    formValid.inputBase = false;
                } else if (!(value > 1 && value < 17)) {
                    fieldValidationErrors.inputBaseError = "The Base should be greater than 1 and less than or equal to 16 ";
                    formValid.inputBase = false;
                } else {
                    fieldValidationErrors.inputBaseError = "";
                    formValid.inputBase = true;
                }
                break;

            case "inputNumber":
                let decSplit = this.decimalSplitter(value, this.state.form.inputBase)
                if (this.state.form.inputBase === "") {
                    fieldValidationErrors.inputNumberError = "Please Enter your Base first and then give your number, follow this sequence strictly";
                    formValid.inputNumber = false;
                } else if (value === "") {
                    fieldValidationErrors.inputNumberError = "field required";
                    formValid.inputNumber = false;
                } else if (decSplit.length === 0) {
                    fieldValidationErrors.inputNumberError = `Please enter a valid number corressponding to your base ${this.state.form.inputBase}`;
                    formValid.inputNumber = false;
                } else {
                    fieldValidationErrors.inputNumberError = "";
                    formValid.inputNumber = true;
                }
                break;

            case "outputBase":
                if (value === "") {
                    fieldValidationErrors.outputBaseError = "field Required";
                    formValid.outputBase = false;
                } else if (!(value > 1 && value < 17)) {
                    fieldValidationErrors.outputBaseError = "The Base should be greater than 1 and less than or equal to 16 ";
                    formValid.outputBase = false;
                } else {
                    fieldValidationErrors.outputBaseError = "";
                    formValid.outputBase = true
                }
                break;
            default:
                break;
        }
        formValid.buttonActive =
            formValid.inputBase &&
            formValid.inputNumber &&
            formValid.outputBase
        this.setState({ formErrorMessage: fieldValidationErrors, formValid: formValid })

    }


    render() {

        return (
            <React.Fragment>
                <Navbar style={{ backgroundColor: "#1E90FF" }} light expand="md">
                    <NavbarBrand href="/" className="font-weight-bold">

                        <div className="mt-3 ml-2 mb-2">

                            <span><ReactFontLoader fonts={[{ name: 'Gochi Hand' }]} />
                                <h3 style={{ fontFamily: 'Gochi Hand' }} className="text-light font-weight-bold"><img style={{ width: "60px", backgroundColor: "#FFFFFF" }} src={Bcon} />&nbsp; baseConverter </h3></span>
                        </div>

                    </NavbarBrand>
                    <NavbarToggler />
                </Navbar>
                <div className="mt-2 mb-4 ml-4 mr-2 ">
                    <ReactFontLoader fonts={[{ name: 'Bree Serif' }]} />
                    <h3 style={{ fontFamily: 'Bree Serif', fontWeight: 'bold' }} className="text-dark ">
                        This is a playground for you, If you want to play with the numbers with different Bases.<br />
                    You can provide your input number with any base.,say decimal,binary,hexa,octa...
                    and you will get that number in your desired base
                </h3>
                </div>


                <Card className="col-md-6 offset-md-3 shadow p-3 mb-5 bg-white rounded ">
                    <CardBody>
                        <ReactFontLoader fonts={[{ name: 'IM Fell English' }]} />
                        <h3 style={{ fontFamily: 'IM Fell English' }} className="text-primary font-weight-bold">Provide your Inputs here </h3>
                        <br />
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <ReactFontLoader fonts={[{ name: 'Bree Serif' }]} />
                                <h4 style={{ fontFamily: 'Bree Serif', fontWeight: 'bold' }} className="text-dark ">Convert from Base</h4>
                                <input className="form-control" type="number" id="inputBase" name="inputBase" value={this.state.form.inputBase} onChange={this.handleChange} />
                                <span className="text-danger">{this.state.formErrorMessage.inputBaseError}</span>
                            </div>

                            <div className="form-group">
                                <ReactFontLoader fonts={[{ name: 'Bree Serif' }]} />
                                <h4 style={{ fontFamily: 'Bree Serif', fontWeight: 'bold' }} className="text-dark ">Number to be converted</h4>
                                <input className="form-control" type="text" id="inputNumber" name="inputNumber" value={this.state.form.inputNumber} onChange={this.handleChange} />
                                <span className="text-danger">{this.state.formErrorMessage.inputNumberError}</span>
                            </div>

                            <div className="form-group">
                                <ReactFontLoader fonts={[{ name: 'Bree Serif' }]} />
                                <h4 style={{ fontFamily: 'Bree Serif', fontWeight: 'bold' }} className="text-dark ">Convert to Base</h4>
                                <input className="form-control" type="number" id="outputBase" name="outputBase" value={this.state.form.outputBase} onChange={this.handleChange} />
                                <span className="text-danger">{this.state.formErrorMessage.outputBaseError}</span>
                            </div>

                            {!this.state.outputNumber ?
                                <>
                                    <div className="form-group">

                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block" disabled={!this.state.formValid.buttonActive}><h5 className="font-weight-bold">Convert</h5></button>
                                    </div>
                                </> :
                                <>
                                    <div className="form-group">
                                        <ReactFontLoader fonts={[{ name: 'Bree Serif' }]} />
                                        <h3 style={{ fontFamily: 'Bree Serif', fontWeight: 'bold' }} className="text-success ">Output</h3>
                                        <CopyToClipboard text={this.state.outputNumber}>
                                            <InputGroup>
                                                <Input className="form-control" id="outputNumber" name="outputNumber" value={this.state.outputNumber} />
                                                <InputGroupAddon addonType="prepend" ><Button color="success">copy to clipboard</Button></InputGroupAddon>
                                            </InputGroup>
                                        </CopyToClipboard>
                                        <br />
                                        <button className="btn btn-warning btn-block" onClick={this.resetState} ><h5 className="font-weight-bold">Reset</h5></button>
                                    </div>
                                </>
                            }
                        </form>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }
}

export default Page