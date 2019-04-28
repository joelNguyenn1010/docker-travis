import axios from '../node_modules/axios'
class Index extends React.Component {

    state = {
        seenIndexes: [],
        values: {},
        index: ''
    }
    componentDidMount() {
      this.fecthValues();
      this.fecthIndex();
    }
    
    fecthValues = async () => {
        const values = await axios.get('/api/values/current');
        this.setState({
            values: values.data
        })
    }

    fecthIndex = async () => {
        const seenIndex = await axios.get('/api/values/all');
        this.setState({
            seenIndexes: seenIndex
        })
    }

    renderSeenIndex = () => {
        return this.state.seenIndexes.map(({number}) => number).join(', ')
    }

    renderValues = () => {
        const entries = []
        for(let key in this.state  .values)
        {
            entries.push(
                <div key={key}>
                        For index {key} I calculated {this.state.values[key]}
                </div>
            )
        }

        return entries
    }

    handleSubmit = async (e) => {

        await axios.post('/api/values', {
            index: this.state.index
        })

        this.setState({index: ''})

        e.preventDefault();

    }
    render() {
        return (
            <div>
            <form onSubmit={this.handleSubmit}>
                <label>Enter index:</label>
                <input 
                values={this.state.index}
                onChange={e => this.setState({ index: e.target.value })}
                />
                <button>Submit</button>
            </form>

         

            <h3>Calculated values:</h3>
            {this.renderValues()}

            </div>
        )
    }
}

export default Index