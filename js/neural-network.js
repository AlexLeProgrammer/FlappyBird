/**
 * Neural - network | script of the neural network class.
 *
 */

"use strict";

/**
 * Represent a neuron.
 */
class Neuron {
    input = null;
    isInput = false;
    weights = [];
    linkedNeurons = [];
    bias = Math.random() * 2 - 1;

    /**
     * Constructor.
     * @param isInput If the neuron is in the first layer of the network : true, else : false.
     * @param linkedNeurons List of the inputs neuron linked to this one.
     */
    constructor(isInput, linkedNeurons) {
        if (!isInput) {
            // If the neuron is not an input, create weights and assign linked neurons
            for (let i = 0; i < linkedNeurons.length; i++) {
                this.weights.push(Math.random() * 2 - 1);
            }

            this.linkedNeurons = linkedNeurons;
        } else {
            this.isInput = true;
        }
    }

    /**
     * Get the output of the neuron.
     * @return {number} The output of the neuron.
     */
    out() {
        if (this.isInput) {
            return this.input;
        }

        let result = 0;
        for (let i = 0; i < this.linkedNeurons.length; i++) {
            result += this.weights[i] * this.linkedNeurons[i].out();
        }

        return result + this.bias;
    }
}

/**
 * Contain a neural network and methods to control it.
 */
class NeuralNetwork {
    neurons = [];

    /**
     * Constructor.
     * @param layers Numbers of neurons in each layer.
     */
    constructor(layers) {
        for (let i = 0; i < layers.length; i++) {
            this.neurons.push([]);
            for (let j = 0; j < layers[i]; j++) {
                if (i === 0) {
                    this.neurons[i].push(new Neuron(true));
                } else {
                    this.neurons[i].push(new Neuron(false, this.neurons[i - 1]));
                }
            }
        }
    }

    /**
     * Get the outputs of the neural network.
     * @param inputs Inputs of the neural network.
     * @return {*[]} The output of the neural network.
     */
    out(inputs) {
        // Set the inputs
        for (let i = 0; i < this.neurons[0].length; i++) {
            this.neurons[0][i].input = inputs[i];
        }

        // Calculate outputs
        let outputs = [];
        for (let neuron of this.neurons[this.neurons.length - 1]) {
            outputs.push(neuron.out());
        }

        return outputs;
    }

    /**
     * Mutate the neural network.
     * @param range Range of the mutation.
     */
    mutate(range) {
        for (let layer of this.neurons) {
            for (let neuron of layer) {
                for (let i = 0; i < neuron.weights.length; i++) {
                    neuron.weights[i] += Math.random() * range * 2 - range;
                }

                neuron.bias += Math.random() * range * 2 - range;
            }
        }
    }

    /**
     * Clone this neural network.
     * @return {NeuralNetwork} The new neural network.
     */
    clone() {
        const layersShape = this.neurons.map(layer => layer.length);
        const cloneNet = new NeuralNetwork(layersShape);

        for (let i = 1; i < this.neurons.length; i++) {
            for (let j = 0; j < this.neurons[i].length; j++) {
                const origNeuron = this.neurons[i][j];
                const clonedNeuron = cloneNet.neurons[i][j];

                clonedNeuron.weights = [...origNeuron.weights];
                clonedNeuron.bias = origNeuron.bias;
            }
        }

        return cloneNet;
    }

}
