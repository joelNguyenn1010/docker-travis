import axios from '../node_modules/axios'
class Index extends React.Component {

    state = {
        values: ''
    }
    componentDidMount() {
        this.fecthValues();
    }

    fecthValues = async () => {
        const values = await axios.get('/api/');
        this.setState({
            values: values.data
        })
    }


    render() {
        return (
            <div>
                {this.state.values}
            </div>
        )
    }
}

export default Index