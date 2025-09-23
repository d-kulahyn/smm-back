<?php

namespace App\Infrastructure\API\Controllers;

/**
 * @OA\Tag(
 *     name="Reports",
 *     description="Analytics and reporting endpoints"
 * )
 */
use App\Application\UseCase\GenerateAutomaticReportUseCase;
use App\Application\UseCase\AddManualMetricUseCase;
use App\Domain\Repository\ProjectReportReadRepositoryInterface;
use App\Domain\Repository\SocialMetricReadRepositoryInterface;
use App\Infrastructure\API\DTO\CreateManualMetricDto;
use App\Infrastructure\API\DTO\GenerateReportDto;
use App\Infrastructure\API\Resource\ProjectReportResource;
use App\Infrastructure\API\Resource\SocialMetricResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ReportController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private ProjectReportReadRepositoryInterface $projectReportReadRepository,
        private SocialMetricReadRepositoryInterface $socialMetricReadRepository,
        private GenerateAutomaticReportUseCase $generateAutomaticReportUseCase,
        private AddManualMetricUseCase $addManualMetricUseCase
    ) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'period_type' => 'nullable|in:daily,weekly,monthly,custom',
        ]);

        $reports = $this->projectReportReadRepository->findByProjectId($request->project_id);

        if ($request->has('period_type')) {
            $reports = $this->projectReportReadRepository->findByPeriodType(
                $request->project_id,
                $request->period_type
            );
        }

        return response()->json([
            'success' => true,
            'data' => ProjectReportResource::collection($reports)
        ]);
    }

    public function generateAutomatic(GenerateReportDto $dto): JsonResponse
    {
        $report = $this->generateAutomaticReportUseCase->execute(
            $dto->project_id,
            $dto->period_type
        );

        return response()->json([
            'success' => true,
            'data' => new ProjectReportResource($report),
            'message' => 'Автоматический отчет сгенерирован'
        ], 201);
    }

    public function addManualMetric(CreateManualMetricDto $dto): JsonResponse
    {
        $metric = $this->addManualMetricUseCase->execute($dto->toArray());

        return response()->json([
            'success' => true,
            'data' => new SocialMetricResource($metric),
            'message' => 'Метрика добавлена'
        ], 201);
    }

    public function metrics(Request $request): JsonResponse
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'platform' => 'nullable|in:instagram,facebook,tiktok,youtube,twitter,linkedin,telegram,all',
            'metric_type' => 'nullable|in:content,audience,engagement,reach,advertising',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($request->has('start_date') && $request->has('end_date')) {
            $metrics = $this->socialMetricReadRepository->getMetricsForPeriod(
                $request->project_id,
                $request->start_date,
                $request->end_date
            );
        } elseif ($request->has('platform')) {
            $metrics = $this->socialMetricReadRepository->findByPlatform(
                $request->project_id,
                $request->platform
            );
        } else {
            $metrics = $this->socialMetricReadRepository->findByProjectId($request->project_id);
        }

        return response()->json([
            'success' => true,
            'data' => SocialMetricResource::collection($metrics)
        ]);
    }

    public function predefinedMetrics(Request $request): JsonResponse
    {
        $platform = $request->get('platform', 'all');
        $predefinedMetrics = $this->addManualMetricUseCase->getPredefinedMetrics($platform);

        return response()->json([
            'success' => true,
            'data' => $predefinedMetrics
        ]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
        ]);

        $latestReport = $this->projectReportReadRepository->getLatestReport($request->project_id);
        $manualMetrics = $this->socialMetricReadRepository->findManualMetrics($request->project_id);
        $automatedMetrics = $this->socialMetricReadRepository->findAutomatedMetrics($request->project_id);

        return response()->json([
            'success' => true,
            'data' => [
                'latest_report' => $latestReport ? new ProjectReportResource($latestReport) : null,
                'manual_metrics_count' => $manualMetrics->count(),
                'automated_metrics_count' => $automatedMetrics->count(),
                'total_metrics' => $manualMetrics->count() + $automatedMetrics->count(),
            ]
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $report = $this->projectReportReadRepository->findById($id);

        if (!$report) {
            throw new \Exception('Report not found');
        }

        return response()->json([
            'success' => true,
            'data' => new ProjectReportResource($report)
        ]);
    }
}
