<script lang="ts">
import { Line, mixins } from "vue-chartjs";
import { Vue, Component } from "vue-property-decorator";
@Component({ extends: Line })
export default class SalesChart extends Vue {
	chartData = {
		labels: ["2/11", "2/14", "2/15", "어제", "오늘"],
		datasets: [
			{
				lineTension: 0,
				label: "매출",
				backgroundColor: "#36AFFF22",
				borderColor: "#36AFFF",
				data: [400, 360, 425, 365, 355]
			}
		]
	};

	public renderChart!: (chartData?: any, options?: any) => void;
	mounted() {
		// Overwriting base render method with actual data.
		this.renderChart(this.chartData, {
			responsive: true,
			maintainAspectRatio: false
		});
	}
}
</script>
<style lang="scss" scoped>
</style>