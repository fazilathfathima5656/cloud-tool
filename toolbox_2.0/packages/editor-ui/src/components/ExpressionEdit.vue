<template>
	<div v-if="dialogVisible" @keydown.stop>
		<el-dialog :visible="dialogVisible" custom-class="expression-dialog" append-to-body width="80%" title="Edit Expression" :before-close="closeDialog">
			<el-row>
				<el-col :span="8">
					<div class="header-side-menu">
						<div class="headline">
							Edit Expression
						</div>
						<div class="sub-headline">
							Variable Selector
						</div>
					</div>

					<div class="variable-selector">
						<variable-selector :path="path" @itemSelected="itemSelected"></variable-selector>
					</div>
				</el-col>
				<el-col :span="16" class="right-side">
					<div class="expression-editor-wrapper">
						<div class="editor-description">
							Expression
						</div>
						<div class="expression-editor">
							<expression-input :parameter="parameter" ref="inputFieldExpression" rows="8" :value="value" :path="path" @change="valueChanged" @keydown.stop="noOp"></expression-input>
						</div>
					</div>

					<div class="expression-result-wrapper">
						<div class="editor-description">
							Result
						</div>
						<expression-input :parameter="parameter" resolvedValue="true" rows="8" :value="value" :path="path"></expression-input>
					</div>

				</el-col>
			</el-row>

		</el-dialog>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

import ExpressionInput from '@/components/ExpressionInput.vue';
import VariableSelector from '@/components/VariableSelector.vue';

import { IVariableItemSelected } from '@/Interface';

import {
	Workflow,
} from '@toolbox/toolbox-workflow';

export default Vue.extend({
	name: 'ExpressionEdit',
	props: [
		'dialogVisible',
		'parameter',
		'path',
		'value',
	],
	components: {
		ExpressionInput,
		VariableSelector,
	},
	data () {
		return {
		};
	},
	methods: {
		valueChanged (value: string) {
			this.$emit('valueChanged', value);
		},

		closeDialog () {
			// Handle the close externally as the visible parameter is an external prop
			// and is so not allowed to be changed here.
			this.$emit('closeDialog');
			return false;
		},

		itemSelected (eventData: IVariableItemSelected) {
			(this.$refs.inputFieldExpression as any).itemSelected(eventData); // tslint:disable-line:no-any
		},
	},
});
</script>

<style scoped lang="scss">
.editor-description {
	font-weight: bold;
	padding: 0 0 0.5em 0.2em;;
}

.expression-result-wrapper,
.expression-editor-wrapper {
	padding: 10px;
}

.expression-result-wrapper {
	margin-top: 1em;
}

::v-deep .expression-dialog {
	.el-dialog__header {
		padding: 0;
	}
	.el-dialog__title {
		display: none;
	}

	.el-dialog__body {
		padding: 0;
	}

	.right-side {
		background-color: #f9f9f9;
	}
}

.header-side-menu {
	padding: 1em 0 0.5em 1.8em;

	background-color: $--custom-window-sidebar-top;
	color: #555;
	border-bottom: 1px solid $--color-primary;
	margin-bottom: 1em;

	.headline {
		font-size: 1.35em;
		font-weight: 600;
	}

	.sub-headline {
		font-weight: 600;
		font-size: 1.1em;
		text-align: center;
		padding-top: 1.5em;
		color: $--color-primary;
	}
}

.variable-selector {
	margin: 0 1em;
}
</style>
